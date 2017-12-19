const create = require('../../crud/create');
const config = require('../../../../config').settings();
const CrisprDefaults = require('../CRISPR/crispr-defaults');
const deepEqual = require('deep-equal');
const fs = require('mz/fs');
const Log = require('../log');
const Params = require('./params');
const query = require('../../query/query');
const StoreOutput = require('../store-output.js');
const spawn = require('child_process').spawn;
const UpdateTask = require('../update-task');

const RANKS = {
  foldChange: (fileNames, task, logBase, writeLog) => {
    return new Promise((resolve, reject) => {
      const numFiles = fileNames.length;

      // run normalize script
      const foldChange = (fileName) => {
        return new Promise((resolveFoldChange, rejectFoldChange) => {
          const foldChangeProcess = spawn(
            `${config.scriptPath}CRISPR/RANKS/foldChange.py`,
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
  normalizeAndFilter: (fileNames, task, params, writeLog) => {
    return new Promise((resolve, reject) => {
      const numFiles = fileNames.length;

      // run normalize script
      const normalize = (fileName) => {
        return new Promise((resolveNormalize, rejectNormalize) => {
          const normalizeProcess = spawn(
            `${config.scriptPath}CRISPR/RANKS/normalizeFilter.py`,
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
  run: (formSamples, details, task, writeLog) => {
    return new Promise((resolve, reject) => {
      // write samples to files based on design
      const taskStatus = {
        status: 'Writing database samples to file system',
        step: 'File creation',
      };

      Promise.all([
        RANKS.sampleToFiles(task.folder, details.design, formSamples),
        UpdateTask.async(task.id, taskStatus),
      ])
        .then((values) => {
          // apply filters and normalization
          const initParams = Params.get(details, CrisprDefaults.all);
          return RANKS.normalizeAndFilter(
            values[0],
            task,
            initParams,
            writeLog
          );
        })
        .then((filteredFileNames) => {
          return RANKS.foldChange(filteredFileNames, task, 2, writeLog);
        })
        .then((fcFileNames) => {
          // get RANKS params
          const RANKSParams = Params.get(details, CrisprDefaults.RANKS);
          // run RANKS
          return RANKS.script(
            fcFileNames,
            task,
            details,
            RANKSParams,
            writeLog
          );
        })
        .then(() => {
          // store log and analysis results
          return Promise.all([
            Log.write(task),
            RANKS.storeOutput(task),
          ]);
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        })
      ;
    });
  },
  sampleToFiles: (folder, design, samples) => {
    return new Promise((resolve, reject) => {
      const errors = [];
      const fileNames = [];

      // check if samples have same guide list (in the same order)
      const compareGuideOrder = (currSamples) => {
        const expectedGuides = currSamples[0].records.map((record) => {
          return record.quideSequence;
        });
        const sameGuideOrder = currSamples.every((sample, i) => {
          if (i === 0) {
            return true;
          }
          const currGuides = sample.records.map((record) => {
            return record.quideSequence;
          });
          return deepEqual(currGuides, expectedGuides);
        });
        return sameGuideOrder;
      };

      // get guides to print out
      const getGuides = (arr) => {
        let guides = [];
        arr.forEach((sample) => {
          const currGuides = sample.records.map((record) => {
            return {
              gene: record.gene,
              guide: record.guideSequence,
            };
          });
          guides = guides.concat(currGuides);
        });
        // remove duplicates
        if (arr.length > 1) {
          guides = guides.filter((guide, index, self) => {
            return self.findIndex((g) => {
              return g.gene === guide.gene && g.guide === guide.guide;
            }) === index;
          });
        }
        return guides;
      };

      // write to file where samples have the same guide set
      const writeInOrder = (guides, sampleSet, currSamples) => {
        sampleSet.controls.forEach((_id, index) => {
          const file = fs.createWriteStream(`${folder}/${sampleSet.name}_C${index + 1}.txt`);
          const sampleIndex = currSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          guides.forEach((guideEntry, i) => {
            const line = `${guideEntry.guide}\t${currSamples[sampleIndex].records[i].readCount}\n`;
            file.write(line);
          });
          file.on('error', () => {
            errors.push(`Input file could not be created from the database,
              for sample ${sampleSet.name}_C${index + 1}`
            );
          });
          fileNames.push(`${sampleSet.name}_C${index + 1}.txt`);
          file.end();
        });
        sampleSet.replicates.forEach((_id, index) => {
          const file = fs.createWriteStream(`${folder}/${sampleSet.name}_R${index + 1}.txt`);
          const sampleIndex = currSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          guides.forEach((guideEntry, i) => {
            const line = `${guideEntry.guide}\t${currSamples[sampleIndex].records[i].readCount}\n`;
            file.write(line);
          });
          file.on('error', () => {
            errors.push(`Input file could not be created from the database,
              for sample ${sampleSet.name}_R${index + 1}`
            );
          });
          fileNames.push(`${sampleSet.name}_R${index + 1}.txt`);
          file.end();
        });
      };

      // write to file where samples do not have the same guide set
      const writeLineByLine = (guides, sampleSet, currSamples) => {
        sampleSet.controls.forEach((_id, index) => {
          const file = fs.createWriteStream(`${folder}/${sampleSet.name}_C${index + 1}.txt`);
          const sampleIndex = currSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          guides.forEach((guideEntry, i) => {
            const recordIndex = currSamples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            const line = recordIndex > -1 ?
              `${guideEntry.guide}\t${currSamples[sampleIndex].records[i].readCount}\n`
              :
              `${guideEntry.guide}\t0\n`
            ;
            file.write(line);
          });
          file.on('error', () => {
            errors.push(`Input file could not be created from the database,
              for sample ${sampleSet.name}_C${index + 1}`
            );
          });
          fileNames.push(`${sampleSet.name}_C${index + 1}.txt`);
          file.end();
        });
        sampleSet.replicates.forEach((_id, index) => {
          const file = fs.createWriteStream(`${folder}/${sampleSet.name}_R${index + 1}.txt`);
          const sampleIndex = currSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          guides.forEach((guideEntry, i) => {
            const recordIndex = currSamples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            const line = recordIndex > -1 ?
              `${guideEntry.guide}\t${currSamples[sampleIndex].records[i].readCount}\n`
              :
              `${guideEntry.guide}\t0\n`
            ;
            file.write(line);
          });
          file.on('error', () => {
            errors.push(`Input file could not be created from the database,
              for sample ${sampleSet.name}_R${index + 1}`
            );
          });
          fileNames.push(`${sampleSet.name}_R${index + 1}.txt`);
          file.end();
        });
      };

      design.forEach((sampleSet) => {
        // get currSamples to use
        const currSamples = sampleSet.controls.concat(sampleSet.replicates).map((_id) => {
          const sampleIndex = samples.findIndex((sample) => { return sample._id === _id; });
          return samples[sampleIndex];
        });
        // write to file
        const sameFormat = compareGuideOrder(currSamples);
        if (sameFormat) {
          const guides = getGuides([currSamples[0]]);
          writeInOrder(guides, sampleSet, currSamples);
        } else {
          const guides = getGuides(samples);
          writeLineByLine(guides, sampleSet, currSamples);
        }
      });
      if (errors.length === 0) {
        resolve(fileNames);
      } else {
        reject(errors.join('. '));
      }
    });
  },
  script: (fileNames, task, details, params, writeLog) => {
    return new Promise((resolve, reject) => {
      const essentialList = `essential_${params.essentialVersion}.txt`;
      const nonEssentialList = `nonessential_${params.essentialVersion}.txt`;
      const numFiles = fileNames.length;

      // run normalize script
      const ranks = (fileName, design) => {
        return new Promise((resolveRANKS, rejectRANKS) => {
          const columns = Array.from(
            new Array(design.replicates.length), (x, i) => { return i + 1; }
          ).join(',');
          const ranksProcess = spawn(
            `${config.scriptPath}CRISPR/RANKS/${config.scripts.RANKS}`,
            [
              '--filename',
              `${fileName}`,
              '--path',
              `${task.folder}/`,
              '--essential',
              `${config.scriptPath}CRISPR/RANKS/EssentialLists/${essentialList}`,
              '--nonessential',
              `${config.scriptPath}CRISPR/RANKS/EssentialLists/${nonEssentialList}`,
              '--columns',
              `${columns}`,
              '--numiter',
              `${params.bootstrapIter}`,
            ]
          );
          let taskStatus = {
            pid: ranks.pid,
            status: 'Starting RANKS',
            step: 'RANKS',
          };
          UpdateTask.sync(task.id, taskStatus);
          ranksProcess.stdout.on('data', (data) => {
            // log stdout, if any
            writeLog(task.folder, data);
          });
          ranksProcess.on('error', (processError) => {
            reject(processError);
          });
          ranksProcess.on('exit', () => {
            fs.access(`${task.folder}/RANKS_${fileName}`)
              .then(() => {
                taskStatus = {
                  pid: 'x',
                  status: 'Complete',
                };
                return UpdateTask.async(task.id, taskStatus);
              })
              .then(() => {
                resolveRANKS(`RANKS_${fileName}`);
              })
              .catch((accessError) => {
                rejectRANKS(accessError);
              })
            ;
          });
        });
      };

      const outFileNames = [];
      const next = (fileName, index) => {
        RANKS(fileName, details.design[index])
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
  storeOutput: (task) => {
    return new Promise((resolve, reject) => {
      // file options
      const csvParams = {
        delimiter: '\t',
        trim: true,
      };
      const columns = {
        gene: 'GENE',
        other: [
          {
            name: 'BF',
            type: 'number',
          },
          {
            name: 'STD',
            type: 'number',
          },
          {
            name: 'NumObs',
            type: 'number',
          },
        ],
      };
      // get sample set names
      query.get('analysisTasks', { _id: task.id }, { details: 1 }, 'findOne')
        .then((taskDetails) => {
          const setNames = taskDetails.details.design.map((sampleSet) => {
            return {
              file: `RANKS_foldchange_filtered_${sampleSet.name}.txt`,
              name: sampleSet.name,
            };
          });
          return StoreOutput.readFiles(columns, csvParams, setNames, task);
        })
        .then((results) => {
          return create.insert('analysisResults', { _id: task.id, results });
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
module.exports = RANKS;
