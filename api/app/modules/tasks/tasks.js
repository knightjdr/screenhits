const AnalysisQueue = require('../analysis/analysis').queue.running;
const query = require('../query/query');

const Tasks = {
  get: (queryParams) => {
    return new Promise((resolve) => {
      console.log(queryParams);
      // format tasks for client
      const formatTasks = (tasks) => {
        const formattedTasks = [];
        // format queued tasks
        AnalysisQueue.forEach((task, queueIndex) => {
          if (queueIndex > 0) {
            formattedTasks.push({
              _id: null,
              isComplete: false,
              isOfficial: false,
              date: task.date,
              error: '',
              name: task.details.analysisName,
              log: '',
              isQueued: true,
              isRunning: false,
              status: `Queued/position ${queueIndex}`,
              user: task.userName,
            });
          }
        });

        // format running or run tasks
        tasks.forEach((task) => {
          const returnDetails = JSON.parse(JSON.stringify(task.details));
          delete returnDetails.analysisName;
          delete returnDetails.creatorName;
          delete returnDetails.creatorEmail;
          delete returnDetails.date;
          formattedTasks.push({
            _id: task._id,
            isComplete: task.isComplete,
            isOfficial: task.isOfficial,
            date: task.date,
            details: returnDetails,
            error: task.error,
            name: task.details.analysisName,
            log: task.log,
            isQueued: false,
            isRunning: task.isRunning,
            status: `${task.step}/${task.status}`,
            user: task.userName,
          });
        });
        return formattedTasks;
      };

      query.get('analysisTasks', {})
        .then((tasks) => {
          const formattedTasks = formatTasks(tasks);
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: formattedTasks,
              message: 'Tasks successfully retrieved',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving tasks: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Tasks;
