const crudUpdate = require('../crud/update');
const query = require('../query/query');
const spawn = require('child_process').spawn;

const UpdateTask = {
  async: (taskID, updateObj) => {
    return new Promise((resolve, reject) => {
      // get current task status to see is it should end
      query.get('analysisTasks', { _id: taskID }, { kill: 1 }, 'findOne')
        .then((taskStatus) => {
          if (taskStatus.kill) {
            reject('Task was cancelled');
          }
          return crudUpdate.insert('analysisTasks', { _id: taskID }, updateObj);
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
  kill: (taskID, userEmail) => {
    return new Promise((resolve) => {
      const killTask = (task) => {
        return new Promise((resolveKill, rejectKill) => {
          if (
            task &&
            task.pid
          ) {
            // kill task and process
            const taskStatus = {
              kill: true,
              status: 'Task killed',
            };
            UpdateTask.async(task._id, taskStatus)
              .then(() => {
                spawn('kill', [task.pid]);
                resolveKill('Task cancelled');
              })
              .catch((error) => {
                rejectKill(error);
              })
            ;
          } else if (
            task
          ) {
            // kill task
            const taskStatus = {
              kill: true,
              status: 'Task killed',
            };
            UpdateTask.async(task._id, taskStatus)
              .then(() => {
                resolveKill('Task cancelled');
              })
              .catch((error) => {
                rejectKill(error);
              })
            ;
          } else {
            resolveKill('The task could not be cancelled: task doesn\'t exist');
          }
        });
      };
      query.get('analysisTasks', { _id: taskID, userEmail }, { pid: 1 }, 'findOne')
        .then((task) => {
          return killTask(task);
        })
        .then((message) => {
          resolve(message);
        })
        .catch((error) => {
          resolve(`The task could not be cancelled: ${String(error)}`);
        })
      ;
    });
  },
  sync: (taskID, updateObj) => {
    // create update object
    crudUpdate.insert('analysisTasks', { _id: taskID }, updateObj);
  },
};
module.exports = UpdateTask;
