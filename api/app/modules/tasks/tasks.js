const AnalysisQueue = require('../analysis/analysis').queue.running;
const arrayUnique = require('../helpers/array-unique');
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

      // get samples for each task
      const mapSamples = (samples, tasks) => {
        const taskWithSamples = tasks;
        tasks.forEach((task, taskIndex) => {
          task.details.design.forEach((sampleSet, designIndex) => {
            taskWithSamples[taskIndex].details.design[designIndex].controlSamples = [];
            taskWithSamples[taskIndex].details.design[designIndex].replicateSamples = [];
            sampleSet.controls.forEach((control) => {
              const sampleIndex = samples.findIndex((sample) => {
                return sample._id === control;
              });
              taskWithSamples[taskIndex].details.design[designIndex].controlSamples
                .push(samples[sampleIndex]);
            });
            sampleSet.replicates.forEach((replicate) => {
              const sampleIndex = samples.findIndex((sample) => {
                return sample._id === replicate;
              });
              taskWithSamples[taskIndex].details.design[designIndex].replicateSamples
                .push(samples[sampleIndex]);
            });
          });
        });
        return taskWithSamples;
      };

      // get sample IDs
      const getSampleIDs = (tasks) => {
        let designSamples = [];
        tasks.forEach((task) => {
          task.details.design.forEach((sampleSet) => {
            designSamples = designSamples.concat(sampleSet.controls);
            designSamples = designSamples.concat(sampleSet.replicates);
          });
        });
        return arrayUnique(designSamples);
      };

      query.get('analysisTasks', {})
        .then((tasks) => {
          const formattedTasks = formatTasks(tasks);
          // get sample IDs
          const designSamples = getSampleIDs(formattedTasks);
          return Promise.all([
            query.get('sample', { _id: { $in: designSamples } }, { records: 0 }),
            formattedTasks,
          ]);
        })
        .then((values) => {
          const tasks = mapSamples(values[0], values[1]);
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: tasks,
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
  getOne: (target, qeury) => {
    return new Promise((resolve) => {
      const contentType = {
        html: 'text/html',
        tsv: 'text/tab-separated-values',
      };
      const formatTask = (task) => {
        let returnElement = '';
        switch (qeury.format) {
          case 'html': {
            break;
          }
          case 'tsv': {
            // format header
            const header = [];
            task.results[0].records.forEach((record) => {
              Object.keys(record).forEach((field) => {
                if (field !== 'sampleSet') {
                  header.push(`${record.sampleSet}_${field}`);
                }
              });
            });
            returnElement += `gene\t${header.join('\t')}\n`;
            // file body
            task.results.forEach((result) => {
              returnElement += `${result.gene}\t`;
              const row = [];
              result.records.forEach((record) => {
                Object.keys(record).forEach((field) => {
                  if (field !== 'sampleSet') {
                    row.push(record[field]);
                  }
                });
              });
              returnElement += `${row.join('\t')}\n`;
            });
            break;
          }
          default:
            break;
        }
        return returnElement;
      };
      query.get('analysisResults', { _id: Number(target) }, {}, 'findOne')
        .then((task) => {
          if (task) {
            resolve({
              status: 200,
              clientResponse: {
                status: 200,
                contentType: contentType[qeury.format],
                data: formatTask(task),
              },
            });
          } else {
            resolve({
              status: 500,
              clientResponse: {
                status: 500,
                message: 'There was an error retrieving this sample',
              },
            });
          }
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving this sample: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Tasks;
