const arrayUnique = require('../helpers/array-unique');
const config = require('../../../config').settings();
const CrisprDefaults = require('./CRISPR/crispr-defaults');
const fs = require('mz/fs');
const query = require('../query/query');
const samplesToFiles = require('./CRISPR/samples-to-files');
const spawn = require('child_process').spawn;

const Pipeline = {
  CRISPR: {
    BAGEL: (fileNames, details, task, updateTask, writeLog) => {
      return new Promise((resolve, reject) => {
        // get params for BAGEL
        const getBagelParams = (analysis, defaults) => {
          const bagelParams = {};
          Object.keys(defaults).forEach((key) => {
            const value = Object.prototype.hasOwnProperty.call(analysis, key) &&
              analysis.key ?
                analysis.key
                :
                defaults[key]
            ;
            bagelParams[key] = value;
          });
          return bagelParams;
        };

        // generate fold change files
        Pipeline.CRISPR.foldChange(fileNames, task, 2, updateTask, writeLog)
          .then((fcFileNames) => {
            // get BAGEL params
            const bagelParams = getBagelParams(details, CrisprDefaults.BAGEL);
            // run BAGEL
            return Pipeline.CRISPR.bagelScript(
              fcFileNames,
              task,
              details,
              bagelParams,
              updateTask,
              writeLog
            );
          })
          .then((bagelFileNames) => {
            resolve(bagelFileNames);
          })
          .catch((error) => {
            reject(error);
          })
        ;
      });
    },
    bagelScript: (fileNames, task, details, params, updateTask, writeLog) => {
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
                `${params.boostrapIter}`,
              ]
            );
            updateTask(task.id, 'Starting BAGEL', 'BAGEL', bagelProcess.pid);
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
                  updateTask(task.id, 'Complete', null, 'x');
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
                next(fileNames, index + 1);
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
    foldChange: (fileNames, task, logBase, updateTask, writeLog) => {
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
            updateTask(task.id, 'Calculating fold changes', 'File processing', foldChangeProcess.pid);
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
                  updateTask(task.id, 'Complete', null, 'x');
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
                next(fileNames, index + 1);
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
    init: (analysisDetails, task, updateTask, writeLog) => {
      return new Promise((resolve, reject) => {
        // get params for init steps
        const getInitParams = (analysis, defaults) => {
          const initParams = {};
          Object.keys(defaults).forEach((key) => {
            const value = Object.prototype.hasOwnProperty.call(analysis, key) &&
              analysis.key ?
                analysis.key
                :
                defaults[key]
            ;
            initParams[key] = value;
          });
          return initParams;
        };

        // get list of samples
        let sampleIDs = [];
        analysisDetails.design.forEach((sampleSet) => {
          const newSamples = sampleSet.controls.concat(sampleSet.replicates);
          sampleIDs = sampleIDs.concat(newSamples);
        });
        sampleIDs = arrayUnique(sampleIDs);

        // get samples from database
        updateTask(task.id, 'Getting samples', 'Database query');
        query.get('sample', { _id: { $in: sampleIDs } }, { records: 1 })
          .then((samples) => {
            // write samples to files based on design
            updateTask(task.id, 'Writing database samples to file system', 'File creation');
            return samplesToFiles.fromDatabase(task.folder, analysisDetails.design, samples);
          })
          .then((fileNames) => {
            // apply filters and normalization
            const initParams = getInitParams(analysisDetails, CrisprDefaults.all);
            return Pipeline.CRISPR.normalizeAndFilter(
              fileNames,
              task,
              initParams,
              updateTask,
              writeLog
            );
          })
          .then((filteredFileNames) => {
            // run type specific pipeline
            return Pipeline.CRISPR[analysisDetails.analysisType](
              filteredFileNames,
              analysisDetails,
              task,
              updateTask,
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
    normalizeAndFilter: (fileNames, task, params, updateTask, writeLog) => {
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
            updateTask(task.id, 'Filtering and normalizing files', 'File formatting', normalizeProcess.pid);
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
                  updateTask(task.id, 'Complete', null, 'x');
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
                next(fileNames, index + 1);
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
};
module.exports = Pipeline;
