const create = require('../../crud/create');
const config = require('../../../../config').settings();
const CrisprDefaults = require('../CRISPR/crispr-defaults');
const fs = require('mz/fs');
const Log = require('../log');
const Params = require('./params');
const query = require('../../query/query');
const StoreOutput = require('../store-output.js');
const spawn = require('child_process').spawn;
const UpdateTask = require('../update-task');

const BAGEL = {
  foldChange: (fileNames, task, logBase, writeLog) => {
    return new Promise((resolve, reject) => {
      const numFiles = fileNames.length;

      // run normalize script
      const foldChange = (fileName) => {
        return new Promise((resolveFoldChange, rejectFoldChange) => {
          const foldChangeProcess = spawn(
            `${config.scriptPath}CRISPR/BAGEL/foldChange.py`,
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
            `${config.scriptPath}CRISPR/BAGEL/normalizeFilter.py`,
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
        BAGEL.sampleToFiles(task.folder, details.design, formSamples),
        UpdateTask.async(task.id, taskStatus),
      ])
        .then((values) => {
          // apply filters and normalization
          const initParams = Params.get(details, CrisprDefaults.all);
          return BAGEL.normalizeAndFilter(
            values[0],
            task,
            initParams,
            writeLog
          );
        })
        .then((filteredFileNames) => {
          return BAGEL.foldChange(filteredFileNames, task, 2, writeLog);
        })
        .then((fcFileNames) => {
          // get BAGEL params
          const bagelParams = Params.get(details, CrisprDefaults.BAGEL);
          // run BAGEL
          return BAGEL.script(
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
            Log.write(task),
            BAGEL.storeOutput(task),
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
  sampleToFiles: (folder, design, samples) => {
    return new Promise((resolve, reject) => {
      const errors = [];
      const fileNames = [];

      // create header
      const createHeader = (controls, replicates) => {
        let header = 'SEQID\tGENE\t';
        header += controls.map((control, i) => {
          return `C${i + 1}`;
        }).join('\t');
        header += '\t';
        header += replicates.map((control, i) => {
          return `R${i + 1}`;
        }).join('\t');
        header += '\n';
        return header;
      };

      // get guides to print out
      const getGuides = (arr) => {
        const guides = {};
        arr.forEach((sample) => {
          sample.records.forEach((record) => {
            if (!guides[record.guideSequence]) {
              guides[record.guideSequence] = record.gene;
            }
          });
        });
        return guides;
      };

      // write to file
      const writeToFile = (guides, header, sampleSet, currSamples) => {
        const mergedSampleIds = sampleSet.controls.concat(sampleSet.replicates);
        // map sample records to an array for quick lookup
        const mappedSampleRecords = [];
        mergedSampleIds.forEach((_id, index) => {
          const sampleIndex = currSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          mappedSampleRecords[index] = {};
          currSamples[sampleIndex].records.forEach((record) => {
            mappedSampleRecords[index][`${record.guideSequence}_${record.gene}`] = record.readCount;
          });
        });
        // write file
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        Object.entries(guides).forEach(([guide, gene]) => {
          let line = `${guide}\t${gene}`;
          const lookupKey = `${guide}_${gene}`;
          mappedSampleRecords.forEach((mappedSample) => {
            if (mappedSample[lookupKey]) {
              line += `\t${mappedSample[lookupKey]}`;
            } else {
              line += '\t0';
            }
          });
          line += '\n';
          file.write(line);
        });
        file.on('error', () => {
          errors.push(`Input file could not be created from the database,
            for sample ${sampleSet.name}`
          );
        });
        fileNames.push(`${sampleSet.name}.txt`);
        file.end();
      };

      design.forEach((sampleSet) => {
        // get currSamples to use
        const currSamples = sampleSet.controls.concat(sampleSet.replicates).map((_id) => {
          const sampleIndex = samples.findIndex((sample) => { return sample._id === _id; });
          return samples[sampleIndex];
        });
        // write to file
        const header = createHeader(sampleSet.controls, sampleSet.replicates);
        const guides = getGuides(samples);
        writeToFile(guides, header, sampleSet, currSamples);
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
      const bagel = (fileName, design) => {
        return new Promise((resolveBagel, rejectBagel) => {
          const columns = Array.from(
            new Array(design.replicates.length), (x, i) => { return i + 1; }
          ).join(',');
          const bagelProcess = spawn(
            `${config.scriptPath}CRISPR/BAGEL/${config.scripts.BAGEL}`,
            [
              '--filename',
              `${fileName}`,
              '--path',
              `${task.folder}/`,
              '--essential',
              `${config.scriptPath}CRISPR/BAGEL/EssentialLists/${essentialList}`,
              '--nonessential',
              `${config.scriptPath}CRISPR/BAGEL/EssentialLists/${nonEssentialList}`,
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
              file: `bagel_foldchange_filtered_${sampleSet.name}.txt`,
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
module.exports = BAGEL;
