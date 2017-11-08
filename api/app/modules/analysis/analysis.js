const config = require('../../../config').settings();
const fs = require('mz/fs');
const moment = require('moment');
const pipeline = require('./pipeline');
// const uuid = require('uuid');

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
  processAnalysisItem: (item) => {
    return new Promise((resolve, reject) => {
      let taskFolder;
      // delete task folder
      const deleteFolder = (folderID) => {
        if (folderID) {
          fs.access(folderID)
            .then(() => {
              fs.rmdir(folderID);
            })
          ;
        }
      };

      // create a unique task ID
      // const id = uuid.v1();
      // create a temporary folder for storing results
      fs.mkdtemp(config.taskDir)
        .then((folder) => {
          taskFolder = folder;
          return pipeline[item.screenType].init(item, taskFolder);
        })
        .then(() => {
          deleteFolder(taskFolder);
        })
        .catch((error) => {
          console.log(`ERROR: ${error}`);
          deleteFolder(taskFolder);
          reject(error);
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
};
module.exports = Analysis;
