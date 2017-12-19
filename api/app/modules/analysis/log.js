const fs = require('mz/fs');
const UpdateTask = require('./update-task');

const LOG = {
  write: (task) => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${task.folder}/log.txt`, 'utf8')
        .then((log) => {
          return UpdateTask.async(task.id, { log });
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = LOG;
