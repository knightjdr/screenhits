const crudUpdate = require('../crud/update');
const query = require('../query/query');

const UpdateTask = {
  async: (taskID, updateObj) => {
    return new Promise((resolve, reject) => {
      // get current task status to see is it should end
      query.get('analysisTasks', { _id: taskID }, { kill: 1 }, 'findOne')
        .then((taskStatus) => {
          if (taskStatus.kill) {
            reject('Task was cancelled');
          }
          return crudUpdate.insert('analysisTasks', { _id: taskID }, { $set: updateObj });
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
                process.kill(taskID.pid, 'SIGINT');
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
      const response = (message) => {
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            message,
          },
        });
      };
      query.get('analysisTasks', { _id: taskID, userEmail }, { pid: 1 }, 'findOne')
        .then((task) => {
          return killTask(task);
        })
        .then((message) => {
          response(message);
        })
        .catch((error) => {
          response(`The task could not be cancelled: ${String(error)}`);
        })
      ;
    });
  },
  sync: (taskID, updateObj) => {
    // create update object
    crudUpdate.insert('analysisTasks', { _id: taskID }, { $set: updateObj });
  },
};
module.exports = UpdateTask;
