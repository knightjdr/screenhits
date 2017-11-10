const config = require('../../../config').settings();
const counter = require('../helpers/counter');
const crudCreate = require('../crud/create');
const crudUpdate = require('../crud/update');
const fs = require('mz/fs');
const moment = require('moment');
const pipeline = require('./pipeline');
// const rimraf = require('rimraf');

const Analysis = {
  create: (form) => {
    return new Promise((resolve) => {
      Analysis.queue.running.push(form);
      resolve({
        status: 200,
        clientResponse: {
          status: 200,
          message: 'Analysis queued',
        },
      });
      // if queue isn't running, start it
      if (!Analysis.queue.inProgress) {
        Analysis.runQueue();
      }
    });
  },
  createTask: (taskID, userEmail, userName) => {
    return new Promise((resolve, reject) => {
      const insertObj = {
        _id: taskID,
        userEmail,
        userName,
        pid: 'x',
        status: 'Task created',
        step: 'Initializing task',
      };
      crudCreate.insert('analysisTasks', insertObj)
        .then(() => { resolve(); })
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
        id: null,
      };
      // delete task folder (need to change to rimraf)
      const deleteFolder = (folderID) => {
        if (
          folderID &&
          folderID !== '/' &&
          folderID !== './'
        ) {
          fs.access(folderID)
            .then(() => {
              fs.rmdir(folderID);
            })
          ;
        }
      };

      // get analysis taskID
      counter.get('analysis')
        .then((taskID) => {
          task.id = taskID;
          // create task in database
          return Analysis.createTask(task.id, item.creatorEmail, item.creatorName);
        })
        .then(() => {
          // create task folder
          Analysis.updateTask(task.id, `Creating folder: ${task.folder}`, 'Task folder');
          return fs.mkdtemp(config.taskPath);
        })
        .then((folder) => {
          task.folder = folder;
          // run analysis pipeline
          const status = `Starting ${item.screenType}:${item.analysisType} pipeline`;
          Analysis.updateTask(task.id, status, 'Pipeline');
          return pipeline[item.screenType].init(
            item,
            task,
            Analysis.updateTask,
            Analysis.writeLog
          );
        })
        .then(() => {
          Analysis.updateTask(task.id, 'Task complete', 'Pipeline');
          deleteFolder(task.folder);
        })
        .catch((error) => {
          console.log(`ERROR: ${error}`);
          Analysis.updateTask(task.id, error);
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
  updateTask: (taskID, status, step, pid) => {
    const updateObj = {};
    if (pid) {
      updateObj.pid = pid;
    }
    if (status) {
      updateObj.status = String(status);
    }
    if (step) {
      updateObj.step = step;
    }
    crudUpdate.insert('analysisTasks', { _id: taskID }, { $set: updateObj });
  },
  writeLog: (folder, data) => {
    fs.appendFile(`${folder}/log.txt`, String(data));
  },
};
module.exports = Analysis;
