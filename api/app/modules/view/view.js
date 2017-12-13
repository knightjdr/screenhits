const formatTask = require('./format-task');
const query = require('../query/query');

const View = {
  get: (_id, user) => {
    return new Promise((resolve) => {
      // make sure task exists, is complete and has no errors
      const checkTask = (task) => {
        return new Promise((resolveCheck, rejectCheck) => {
          if (!task) {
            rejectCheck('Task does not exist');
          } else if (task.isRunning) {
            rejectCheck('Task is running. Try again when the task is complete');
          } else if (task.error) {
            rejectCheck('The task failed. Only successfully completed tasks can be visualized');
          } else {
            resolveCheck();
          }
        });
      };

      const viewTask = {};
      Promise.all([
        query.get('analysisTasks', { _id }, {}, 'findOne'),
        query.get('analysisResults', { _id }, {}, 'findOne'),
      ])
        .then((values) => {
          viewTask.status = values[0];
          viewTask.results = values[1].results;
          return checkTask(viewTask.status);
        })
        .then(() => {
          const analysisType = viewTask.status.details.analysisType;
          const screenType = viewTask.status.details.screenType;
          return formatTask[screenType][analysisType](viewTask);
        })
        .then((formattedTask) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: formattedTask,
              message: 'Task view successfully retrieved',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving this task: ${error}`,
            },
          });
        })
      ;
    });
  },
};

module.exports = View;
