const fs = require('mz/fs');
const UpdateTask = require('./update-task');

const LOG = {
  write: (task) => {
    return new Promise((resolve) => {
      fs.readFile(`${task.folder}/log.txt`, 'utf8')
        .then((log) => {
          return UpdateTask.async(task.id, { log });
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          // if there is not file, simply resolve
          resolve();
        })
      ;
    });
  },
};
module.exports = LOG;
