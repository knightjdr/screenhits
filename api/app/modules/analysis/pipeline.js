const arrayUnique = require('../helpers/array-unique');
const config = require('../../../config').settings();
const Convert = require('./convert-input.js');
const CrisprDefaults = require('./CRISPR/crispr-defaults');
const fs = require('mz/fs');
const Permission = require('../permission/permission');
const query = require('../query/query');
const samplesToFiles = require('./CRISPR/samples-to-files');
const StoreOutput = require('./store-output.js');
const spawn = require('child_process').spawn;
const UpdateTask = require('./update-task');

const Pipeline = {
  CRISPR: {
    BAGEL: (fileNames, details, task, writeLog) => {
      return new Promise((resolve, reject) => {
        // generate fold change files
        Pipeline.CRISPR.foldChange(fileNames, task, 2, writeLog)
          .then((fcFileNames) => {
            // get BAGEL params
            const bagelParams = Pipeline.getParams(details, CrisprDefaults.BAGEL);
            // run BAGEL
            return Pipeline.CRISPR.bagelScript(
              fcFileNames,
              task,
              details,
              bagelParams,
              writeLog
            );
          })
          .then(() => {
            // store log and analysis results
            return Promise.all([
              Pipeline.log(task),
              StoreOutput.BAGEL(task),
            ]);
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
    bagelScript: (fileNames, task, details, params, writeLog) => {
      return new Promise((resolve, reject) => {
        const essentialList = `essential_${params.essentialVersion}.txt`;
        const nonEssentialList = `nonessential_${params.essentialVersion}.txt`;
        const numFiles = fileNames.length;

        // run normalize script
        const bagel = (fileName, design) => {
          return new Promise((resolveBagel, rejectBagel) => {
            const columns = Array.from(
              new Array(design.replicates.length), (x, i) => { return i + 1; }
            ).join(',');
            const bagelProcess = spawn(
              `${config.scriptPath}CRISPR/${config.scripts.BAGEL}`,
              [
                '--filename',
                `${fileName}`,
                '--path',
                `${task.folder}/`,
                '--essential',
                `${config.scriptPath}CRISPR/EssentialLists/${essentialList}`,
                '--nonessential',
                `${config.scriptPath}CRISPR/EssentialLists/${nonEssentialList}`,
                '--columns',
                `${columns}`,
                '--numiter',
                `${params.bootstrapIter}`,
              ]
            );
            let taskStatus = {
              pid: bagelProcess.pid,
              status: 'Starting BAGEL',
              step: 'BAGEL',
            };
            UpdateTask.sync(task.id, taskStatus);
            bagelProcess.stdout.on('data', (data) => {
              // log stdout, if any
              writeLog(task.folder, data);
            });
            bagelProcess.on('error', (processError) => {
              reject(processError);
            });
            bagelProcess.on('exit', () => {
              fs.access(`${task.folder}/bagel_${fileName}`)
                .then(() => {
                  taskStatus = {
                    pid: 'x',
                    status: 'Complete',
                  };
                  return UpdateTask.async(task.id, taskStatus);
                })
                .then(() => {
                  resolveBagel(`bagel_${fileName}`);
                })
                .catch((accessError) => {
                  rejectBagel(accessError);
                })
              ;
            });
          });
        };

        const outFileNames = [];
        const next = (fileName, index) => {
          bagel(fileName, details.design[index])
            .then((outFileName) => {
              outFileNames.push(outFileName);
              if (index < numFiles - 1) {
                next(fileNames[index + 1], index + 1);
              } else {
                resolve(outFileNames);
              }
            })
            .catch((error) => {
              reject(error);
            })
          ;
        };
        next(fileNames[0], 0);
      });
    },
    foldChange: (fileNames, task, logBase, writeLog) => {
      return new Promise((resolve, reject) => {
        const numFiles = fileNames.length;

        // run normalize script
        const foldChange = (fileName) => {
          return new Promise((resolveFoldChange, rejectFoldChange) => {
            const foldChangeProcess = spawn(
              `${config.scriptPath}CRISPR/foldChange.py`,
              [
                '--filename',
                `${fileName}`,
                '--path',
                `${task.folder}/`,
                '--log',
                `${logBase}`,
              ]
            );
            let taskStatus = {
              pid: foldChangeProcess.pid,
              status: 'Calculating fold changes',
              step: 'File processing',
            };
            UpdateTask.sync(task.id, taskStatus);
            foldChangeProcess.stdout.on('data', (data) => {
              // log stdout, if any
              writeLog(task.folder, data);
            });
            foldChangeProcess.on('error', (processError) => {
              reject(processError);
            });
            foldChangeProcess.on('exit', () => {
              fs.access(`${task.folder}/foldchange_${fileName}`)
                .then(() => {
                  taskStatus = {
                    pid: 'x',
                    status: 'Complete',
                  };
                  return UpdateTask.async(task.id, taskStatus);
                })
                .then(() => {
                  resolveFoldChange(`foldchange_${fileName}`);
                })
                .catch((accessError) => {
                  rejectFoldChange(accessError);
                })
              ;
            });
          });
        };

        const outFileNames = [];
        const next = (fileName, index) => {
          foldChange(fileName)
            .then((outFileName) => {
              outFileNames.push(outFileName);
              if (index < numFiles - 1) {
                next(fileNames[index + 1], index + 1);
              } else {
                resolve(outFileNames);
              }
            })
            .catch((error) => {
              reject(error);
            })
          ;
        };
        next(fileNames[0], 0);
      });
    },
    init: (analysisDetails, task, writeLog) => {
      return new Promise((resolve, reject) => {
        // get list of samples
        let sampleIDs = [];
        analysisDetails.design.forEach((sampleSet) => {
          const newSamples = sampleSet.controls.concat(sampleSet.replicates);
          sampleIDs = sampleIDs.concat(newSamples);
        });
        sampleIDs = arrayUnique(sampleIDs);

        // get samples from database
        let taskStatus = {
          status: 'Getting samples',
          step: 'Database query',
        };
        UpdateTask.sync(task.id, taskStatus);
        let formSamples;
        Promise.all([
          query.get('sample', { _id: { $in: sampleIDs } }, { group: 1, records: 1 }),
          query.get('users', { email: task.userEmail }, { }, 'findOne'),
        ])
          .then((values) => {
            formSamples = values[0];
            const projects = values[0].map((sample) => { return sample.group.project; });
            return Permission.canView.projects(projects, values[1]);
          })
          .then(() => {
            // write samples to files based on design
            taskStatus = {
              status: 'Writing database samples to file system',
              step: 'File creation',
            };
            return Promise.all([
              samplesToFiles.fromDatabase(task.folder, analysisDetails.design, formSamples),
              UpdateTask.async(task.id, taskStatus),
            ]);
          })
          .then((values) => {
            // apply filters and normalization
            const initParams = Pipeline.getParams(analysisDetails, CrisprDefaults.all);
            return Pipeline.CRISPR.normalizeAndFilter(
              values[0],
              task,
              initParams,
              writeLog
            );
          })
          .then((filteredFileNames) => {
            // run type specific pipeline
            return Pipeline.CRISPR[analysisDetails.analysisType](
              filteredFileNames,
              analysisDetails,
              task,
              writeLog
            );
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
    normalizeAndFilter: (fileNames, task, params, writeLog) => {
      return new Promise((resolve, reject) => {
        const numFiles = fileNames.length;

        // run normalize script
        const normalize = (fileName) => {
          return new Promise((resolveNormalize, rejectNormalize) => {
            const normalizeProcess = spawn(
              `${config.scriptPath}CRISPR/normalizeFilter.py`,
              [
                '--filename',
                `${fileName}`,
                '--path',
                `${task.folder}/`,
                '--minReadCount',
                `${params.minReadCount}`,
                '--minGuides',
                `${params.minGuides}`,
                '--norm',
                `${params.norm}`,
                '--normCount',
                `${params.normCount}`,
              ]
            );
            let taskStatus = {
              pid: normalizeProcess.pid,
              status: 'Filtering and normalizing files',
              step: 'File formatting',
            };
            UpdateTask.sync(task.id, taskStatus);
            normalizeProcess.stdout.on('data', (data) => {
              // log stdout, if any
              writeLog(task.folder, data);
            });
            normalizeProcess.on('error', (processError) => {
              reject(processError);
            });
            normalizeProcess.on('exit', () => {
              fs.access(`${task.folder}/filtered_${fileName}`)
                .then(() => {
                  taskStatus = {
                    pid: 'x',
                    status: 'Complete',
                  };
                  return UpdateTask.async(task.id, taskStatus);
                })
                .then(() => {
                  resolveNormalize(`filtered_${fileName}`);
                })
                .catch((accessError) => {
                  rejectNormalize(accessError);
                })
              ;
            });
          });
        };

        const outFileNames = [];
        const next = (fileName, index) => {
          normalize(fileName)
            .then((outFileName) => {
              outFileNames.push(outFileName);
              if (index < numFiles - 1) {
                next(fileNames[index + 1], index + 1);
              } else {
                resolve(outFileNames);
              }
            })
            .catch((error) => {
              reject(error);
            })
          ;
        };
        next(fileNames[0], 0);
      });
    },
  },
  getParams: (analysis, defaults) => {
    const params = {};
    // want to ensure input field and default are both of the same type:
    // text or numeric, if not then use the default
    Object.keys(defaults).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(analysis, key) &&
        analysis[key] &&
        (
          (isNaN(analysis[key]) && isNaN(defaults[key])) ||
          (!isNaN(analysis[key]) && !isNaN(defaults[key]))
        ) ?
          Convert.UnknownInputType(analysis[key])
          :
          defaults[key]
      ;
      params[key] = value;
    });
    return params;
  },
  log: (task) => {
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
module.exports = Pipeline;
