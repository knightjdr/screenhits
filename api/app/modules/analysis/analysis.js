const config = require('../../../config').settings();
const counter = require('../helpers/counter');
const crudCreate = require('../crud/create');
const fs = require('mz/fs');
const moment = require('moment');
const pipeline = require('./pipeline');
const rimraf = require('rimraf');
const UpdateTask = require('./update-task');

const Analysis = {
  create: (form, user) => {
    return new Promise((resolve) => {
      // get task ID, set time and queue

      counter.get('analysis')
        .then((taskID) => {
          Analysis.queue.running.push(
            Object.assign(
              {},
              form,
              {
                _id: taskID,
                date: moment().format('MMMM Do YYYY, h:mm a'),
                lab: user.lab,
                userEmail: user.email,
                userName: user.name,
              }
            )
          );
          // if queue isn't running, start it
          if (!Analysis.queue.inProgress) {
            Analysis.runQueue();
          }
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Analysis queued',
            },
          });
        })
        .catch(() => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: 'Analysis could not be queued',
            },
          });
        })
      ;
    });
  },
  createTask: (item) => {
    return new Promise((resolve, reject) => {
      const storeItem = JSON.parse(JSON.stringify(item));
      delete storeItem._id;
      delete storeItem.date;
      delete storeItem.lab;
      delete storeItem.userEmail;
      delete storeItem.userName;
      const insertObj = {
        _id: item._id,
        isComplete: false,
        isOfficial: false,
        date: item.date,
        details: storeItem,
        error: '',
        folder: null,
        isRunning: true,
        kill: false,
        lab: item.lab,
        log: null,
        pid: 'x',
        status: 'Task created',
        step: 'Initializing task',
        userEmail: item.userEmail,
        userName: item.userName,
      };
      crudCreate.insert('analysisTasks', insertObj)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  processAnalysisItem: (item) => {
    return new Promise((resolve, reject) => {
      const task = {
        folder: null,
        id: item._id,
        userEmail: item.userEmail,
      };
      // delete task folder
      const deleteFolder = (folderID) => {
        if (
          folderID &&
          folderID !== '/' &&
          folderID !== './'
        ) {
          fs.access(folderID)
            .then(() => {
              rimraf(folderID, () => {});
            })
          ;
        }
      };

      // get analysis taskID
      Analysis.createTask(item)
        .then(() => {
          // create task folder
          const taskStatus = {
            status: 'Creating folder',
            step: 'Task folder',
          };
          return Promise.all([
            fs.mkdtemp(config.taskPath),
            UpdateTask.async(task.id, taskStatus),
          ]);
        })
        .then((values) => {
          task.folder = values[0];
          // run analysis pipeline
          const taskStatus = {
            folder: task.folder,
            status: `Starting ${item.screenType}:${item.analysisType} pipeline`,
            step: 'Pipeline',
          };
          return UpdateTask.async(task.id, taskStatus);
        })
        .then(() => {
          return pipeline[item.screenType].init(
            item,
            task,
            Analysis.writeLog
          );
        })
        .then(() => {
          const taskStatus = {
            isComplete: true,
            isRunning: false,
            status: 'Task complete',
            step: 'Pipeline',
          };
          return UpdateTask.async(task.id, taskStatus);
        })
        .then(() => {
          deleteFolder(task.folder);
          resolve();
        })
        .catch((error) => {
          const taskStatus = {
            error: String(error),
            isRunning: false,
            status: 'error',
          };
          UpdateTask.sync(task.id, taskStatus);
          deleteFolder(task.folder);
          reject(String(error));
        })
      ;
    });
  },
  queue: {
    errors: [],
    finished: [],
    inProgess: false,
    running: [],
  },
  removeFromQueue: (index) => {
    Analysis.queue.running = Analysis.queue.running.splice(index, 1);
  },
  runQueue: () => {
    Analysis.queue.inProgress = true;
    const next = (array) => {
      if (array.length > 0) {
        Analysis.processAnalysisItem(array[0])
          .then(() => {
            Analysis.updateQueue('finished');
            next(Analysis.queue.running);
          })
          .catch((error) => {
            Analysis.updateQueue('errors', error);
            next(Analysis.queue.running);
          })
        ;
      } else {
        Analysis.queue.inProgress = false;
      }
    };
    next(Analysis.queue.running);
  },
  updateQueue: (type, error) => {
    const runItem = {
      date: moment().format('MMMM Do YYYY, h:mm a'),
      itemName: Analysis.queue.running[0].analysisName ?
        Analysis.queue.running[0].analysisName
        :
        'unknown sample',
      userName: Analysis.queue.running[0].creatorName ?
        Analysis.queue.running[0].creatorName
        :
        'unknown user',
    };
    if (error) {
      runItem.error = typeof error !== 'string' ? 'unknown error' : error;
    }
    Analysis.queue[type].unshift(runItem);
    // check if finished or error arrays are too long (> 100)
    if (Analysis.queue[type].length > 100) {
      Analysis.queue[type].splice(100, Analysis.queue[type].length - 100);
    }
    // remove sample from running queue
    Analysis.queue.running.splice(0, 1);
  },
  writeLog: (folder, data) => {
    fs.appendFile(`${folder}/log.txt`, String(data));
  },
};
module.exports = Analysis;
