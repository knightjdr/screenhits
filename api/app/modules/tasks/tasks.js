const Analysis = require('../analysis/analysis');
const arrayUnique = require('../helpers/array-unique');
const crudDelete = require('../crud/delete');
const Permission = require('../permission/permission');
const query = require('../query/query');
const UpdateTask = require('../analysis/update-task');

const Tasks = {
  canAccess: (user) => {
    return new Promise((resolve, reject) => {
      // create query object
      const createQuery = (customPermissions) => {
        if (user.privilege === 'siteAdmin') {
          return {};
        }

        // lab admins cannot be blocked from their own labs project
        const canBlock = (currUser, item) => {
          if (
            currUser.privilege === 'labAdmin' &&
            currUser.lab === item.lab
          ) {
            return false;
          }
          return true;
        };

        const ninUsers = []; // users that have blocked current user
        let inUsers = [user.email]; // users that allow access
        customPermissions.forEach((permission) => {
          if (permission._id === 'global') {
            inUsers = inUsers.concat(permission.list);
          } else {
            permission.list.forEach((item) => {
              if (item.access) {
                user.push(item.user);
              } else if (canBlock(user, item)) {
                ninUsers.push(item.user);
              }
            });
          }
        });
        inUsers = arrayUnique(inUsers);
        return {
          $and: [
            { userEmail: { $nin: ninUsers } },
            {
              $or: [
                { userEmail: { $in: inUsers } }, // created the task
                { lab: user.lab },
              ],
            },
          ],
        };
      };

      query.get('taskPermissions', { _id: { $in: ['global', user.email] } })
        .then((customPermissions) => {
          const queryObj = createQuery(customPermissions);
          return query.get('analysisTasks', queryObj);
        })
        .then((tasks) => {
          resolve(tasks);
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  delete: (_id, user) => {
    return new Promise((resolve) => {
      const resolveFunc = (message, status) => {
        resolve({
          status,
          clientResponse: {
            status,
            message,
          },
        });
      };

      // if task is in queue
      const queueIndex = Analysis.queue.running.findIndex((queued) => {
        return queued._id === _id;
      });

      if (queueIndex > 0) {
        Permission.canEdit.analysis(_id, user, Analysis.queue.running[queueIndex])
          .then(() => {
            Analysis.removeFromQueue(queueIndex);
            resolveFunc('Task cancelled', 200);
          })
          .catch((error) => {
            resolveFunc(`Task could not be cancelled: ${error}`, 500);
          })
        ;
      } else if (queueIndex === 0) { // if task is running, kill it
        Permission.canEdit.analysis(_id, user)
          .then(() => {
            return UpdateTask.kill(_id, user.email);
          })
          .then(() => {
            return crudDelete.item('analysisTasks', { _id });
          })
          .then(() => {
            resolveFunc('Task cancelled', 200);
          })
          .catch((error) => {
            resolveFunc(`Task could not be cancelled: ${error}`, 500);
          })
        ;
      } else { // if task has completed, delete from database
        Permission.canEdit.analysis(_id, user)
          .then(() => {
            return query.get('analysisTasks', { _id, userEmail: user.email }, { _id: 1 }, 'findOne');
          })
          .then((task) => {
            if (task._id) {
              return Promise.all([
                crudDelete.item('analysisTasks', { _id }),
                crudDelete.item('analysisResults', { _id }),
              ]);
            }
            throw new Error('No task matching query');
          })
          .then(() => {
            resolveFunc('Task deleted', 200);
          })
          .catch((error) => {
            resolveFunc(`Task could not be deleted: ${error}`, 500);
          })
        ;
      }
    });
  },
  get: (user) => {
    return new Promise((resolve) => {
      // format tasks for client
      const formatTasks = (tasks) => {
        const formattedTasks = [];
        // format queued tasks
        Analysis.queue.running.forEach((task, queueIndex) => {
          if (queueIndex > 0) {
            formattedTasks.push({
              _id: task._id,
              analysisType: task.details.analysisType,
              date: task.date,
              error: '',
              isComplete: false,
              isOfficial: false,
              isQueued: true,
              isRunning: false,
              lab: task.lab,
              log: '',
              name: task.details.analysisName,
              screenType: task.details.screenType,
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
            analysisType: task.details.analysisType,
            date: task.date,
            details: returnDetails,
            error: task.error,
            isComplete: task.isComplete,
            isOfficial: task.isOfficial,
            isQueued: false,
            isRunning: task.isRunning,
            lab: task.lab,
            log: task.log,
            name: task.details.analysisName,
            screenType: task.details.screenType,
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

      Tasks.canAccess(user)
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
  getOne: (_id, queryObj, user) => {
    return new Promise((resolve) => {
      const contentType = {
        html: 'text/html',
        tsv: 'text/tab-separated-values',
      };
      const formatTask = (task) => {
        let returnElement = '';
        switch (queryObj.format) {
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

      Permission.canView.analysis(_id, user)
        .then(() => {
          return query.get('analysisResults', { _id }, {}, 'findOne');
        })
        .then((task) => {
          if (task) {
            resolve({
              status: 200,
              clientResponse: {
                status: 200,
                contentType: contentType[queryObj.format],
                data: formatTask(task),
              },
            });
          } else {
            resolve({
              status: 500,
              clientResponse: {
                status: 500,
                message: 'There was an error retrieving this task: no such task',
              },
            });
          }
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
module.exports = Tasks;
