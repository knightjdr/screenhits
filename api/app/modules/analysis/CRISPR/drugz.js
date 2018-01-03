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

const drugZ = {
  foldChange: (fileNames, task, logBase, writeLog) => {
    return new Promise((resolve, reject) => {
      const numFiles = fileNames.length;

      // run normalize script
      const foldChange = (fileName) => {
        return new Promise((resolveFoldChange, rejectFoldChange) => {
          const foldChangeProcess = spawn(
            `${config.scriptPath}CRISPR/drugZ/foldChange.py`,
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
            `${config.scriptPath}CRISPR/drugZ/normalizeFilter.py`,
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
        drugZ.sampleToFiles(task.folder, details.design, formSamples),
        UpdateTask.async(task.id, taskStatus),
      ])
        .then((values) => {
          // apply filters and normalization
          const initParams = Params.get(details, CrisprDefaults.all);
          return drugZ.normalizeAndFilter(
            values[0],
            task,
            initParams,
            writeLog
          );
        })
        .then((filteredFileNames) => {
          // get drugZ params
          const drugzParams = Params.get(details, CrisprDefaults.drugZ);
          // run drugZ
          return drugZ.script(
            filteredFileNames,
            task,
            details,
            drugzParams,
            writeLog
          );
        })
        .then(() => {
          // store log and analysis results
          return Promise.all([
            Log.write(task),
            drugZ.storeOutput(task),
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

      // create header
      const createHeader = (controls, replicates) => {
        let header = 'GENE_CLONE\tGENE\t';
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

      // write to file where sampleshave the same guide set
      const writeInOrder = (guides, header, sampleSet, currSamples) => {
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        guides.forEach((guideEntry, i) => {
          let line = `${guideEntry.gene}_${guideEntry.guide}\t${guideEntry.gene}`;
          sampleSet.controls.concat(sampleSet.replicates).forEach((_id) => {
            const sampleIndex = currSamples.findIndex((sample) => {
              return sample._id === _id;
            });
            line += `\t${currSamples[sampleIndex].records[i].readCount}`;
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

      // write to file where samples do not have the same guide set
      const writeLineByLine = (guides, header, sampleSet, currSamples) => {
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        guides.forEach((guideEntry) => {
          let line = `${guideEntry.gene}_${guideEntry.guide}\t${guideEntry.gene}`;
          sampleSet.controls.concat(sampleSet.replicates).forEach((_id) => {
            const sampleIndex = currSamples.findIndex((sample) => {
              return sample._id === _id;
            });
            const recordIndex = currSamples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            line += recordIndex > -1 ?
              `\t${currSamples[sampleIndex].records[recordIndex].readCount}`
              :
              0
            ;
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
        const sameFormat = compareGuideOrder(currSamples);
        if (sameFormat) {
          const guides = getGuides([currSamples[0]]);
          writeInOrder(guides, header, sampleSet, currSamples);
        } else {
          const guides = getGuides(samples);
          writeLineByLine(guides, header, sampleSet, currSamples);
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
      const nonEssentialList = `nonessential_${params.nonEssentialVersion}.txt`;
      const numFiles = fileNames.length;

      // run drugz script
      const drugz = (fileName, design) => {
        return new Promise((resolveDrugz, rejectDrugz) => {
          const controlColumns = Array.from(
            new Array(design.replicates.length), (x, i) => { return `C${i + 1}`; }
          ).join(',');
          const replicateColumns = Array.from(
            new Array(design.replicates.length), (x, i) => { return `R${i + 1}`; }
          ).join(',');
          const removeGenes = params.removeGenes ?
            params.removeGenes.split(/, */).join(',')
            :
            ''
          ;
          const drugzProcess = spawn(
            `${config.scriptPath}CRISPR/drugZ/${config.scripts.drugZ}`,
            [
              '-i',
              `${task.folder}/${fileName}`,
              '-o',
              `${task.folder}/drugz_${fileName}`,
              '-n',
              `${config.scriptPath}CRISPR/drugZ/EssentialLists/${nonEssentialList}`,
              '-c',
              `${controlColumns}`,
              '-x',
              `${replicateColumns}`,
              '-p',
              `${params.pseudoCount}`,
              '-r',
              `${removeGenes}`,
            ]
          );
          let taskStatus = {
            pid: drugzProcess.pid,
            status: 'Starting drugZ',
            step: 'drugZ',
          };
          UpdateTask.sync(task.id, taskStatus);
          drugzProcess.stdout.on('data', (data) => {
            // log stdout, if any
            writeLog(task.folder, data);
          });
          drugzProcess.on('error', (processError) => {
            reject(processError);
          });
          drugzProcess.on('exit', () => {
            fs.access(`${task.folder}/drugz_${fileName}`)
              .then(() => {
                taskStatus = {
                  pid: 'x',
                  status: 'Complete',
                };
                return UpdateTask.async(task.id, taskStatus);
              })
              .then(() => {
                resolveDrugz(`drugz_${fileName}`);
              })
              .catch((accessError) => {
                rejectDrugz(accessError);
              })
            ;
          });
        });
      };

      const outFileNames = [];
      const next = (fileName, index) => {
        drugz(fileName, details.design[index])
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
            name: 'sumZ',
            type: 'number',
          },
          {
            name: 'numObs',
            type: 'number',
          },
          {
            name: 'normZ',
            type: 'number',
          },
          {
            name: 'pval_synth',
            type: 'number',
          },
          {
            name: 'rank_synth',
            type: 'number',
          },
          {
            name: 'fdr_synth',
            type: 'number',
          },
          {
            name: 'pval_supp',
            type: 'number',
          },
          {
            name: 'rank_supp',
            type: 'number',
          },
          {
            name: 'fdr_supp',
            type: 'number',
          },
        ],
      };
      // get sample set names
      query.get('analysisTasks', { _id: task.id }, { details: 1 }, 'findOne')
        .then((taskDetails) => {
          const setNames = taskDetails.details.design.map((sampleSet) => {
            return {
              file: `drugz_filtered_${sampleSet.name}.txt`,
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
module.exports = drugZ;
