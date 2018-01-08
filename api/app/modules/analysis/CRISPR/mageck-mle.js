const ArraySort = require('../../helpers/sort');
const config = require('../../../../config').settings();
const create = require('../../crud/create');
const CrisprDefaults = require('../CRISPR/crispr-defaults');
const csv = require('csvtojson');
const deepEqual = require('deep-equal');
const fs = require('mz/fs');
const Log = require('../log');
const Params = require('./params');
const spawn = require('child_process').spawn;
const Unique = require('../../helpers/array-unique');
const UpdateTask = require('../update-task');

const MAGeCK = {
  designFile: (design, folder) => {
    return new Promise((resolve, reject) => {
      // get list of controls
      let controls = [];
      const sampleSets = [];
      design.forEach((sampleSet) => {
        sampleSet.controls.forEach((controlId) => {
          controls.push(controlId);
        });
        sampleSets.push(sampleSet.name);
      });
      controls = Unique(controls);

      // init design JSON
      const designJson = {
        Samples: [],
        baseline: [],
      };
      sampleSets.forEach((sampleSetName) => {
        designJson[sampleSetName] = [];
      });

      // fill control values into design JSON
      controls.forEach((_id) => {
        designJson.Samples.push(`C.${_id}`);
        designJson.baseline.push(1);
        sampleSets.forEach((sampleSetName) => {
          designJson[sampleSetName].push(0);
        });
      });

      // fill replicate values into design JSON
      design.forEach((sampleSet) => {
        const currSetName = sampleSet.name;
        sampleSet.replicates.forEach((replicateId, repIndex) => {
          designJson.Samples.push(`R.${replicateId}.${repIndex + 1}`);
          designJson.baseline.push(1);
          sampleSets.forEach((sampleSetName) => {
            if (sampleSetName === currSetName) {
              designJson[sampleSetName].push(1);
            } else {
              designJson[sampleSetName].push(0);
            }
          });
        });
      });

      // convert JSON to tsv
      let designProps = Object.keys(designJson);
      let body = '';
      designJson.Samples.forEach((sampleName, index) => {
        const currRow = [];
        designProps.forEach((headerName) => {
          currRow.push(designJson[headerName][index]);
        });
        body += currRow.join('\t');
        body += '\n';
      });
      // replace non-alphanumeric symbols in header names
      designProps = designProps.map((prop) => {
        return prop.replace(/[^A-Za-z0-9._-]/g, '_');
      });
      const header = designProps.join('\t');
      const tsv = `${header}\n${body}`;

      // write TSV
      const file = fs.createWriteStream(`${folder}/designfile.tsv`);
      file.write(tsv);
      file.on('error', () => {
        reject('Design file could not be created');
      });
      file.end();

      resolve();
    });
  },
  normalizeAndFilter: (fileName, task, params, writeLog) => {
    return new Promise((resolve, reject) => {
      // run normalize script
      const normalize = () => {
        return new Promise((resolveNormalize, rejectNormalize) => {
          const normalizeProcess = spawn(
            `${config.scriptPath}CRISPR/MAGeCK/normalizeFilter.py`,
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
                resolveNormalize();
              })
              .catch((accessError) => {
                rejectNormalize(accessError);
              })
            ;
          });
        });
      };

      normalize()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
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
        MAGeCK.sampleToFiles(task.folder, details.design, formSamples),
        UpdateTask.async(task.id, taskStatus),
      ])
        .then(() => {
          // apply filters and normalization
          const initParams = Params.get(details, CrisprDefaults.all);
          return Promise.all([
            MAGeCK.normalizeAndFilter(
              'samples.txt',
              task,
              initParams,
              writeLog
            ),
            MAGeCK.designFile(details.design, task.folder),
          ]);
        })
        .then(() => {
          // get MAGeCK params
          const mageckParams = Params.get(details, CrisprDefaults.MAGeCKmle);
          // run MAGeCK
          return MAGeCK.script(
            'filtered_samples.txt',
            task,
            mageckParams,
            writeLog
          );
        })
        .then(() => {
          // store log and analysis results
          return Promise.all([
            Log.write(task),
            MAGeCK.storeOutput(details.design, task),
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
      // check if samples have same guide list (in the same order)
      const compareGuideOrder = () => {
        const expectedGuides = samples[0].records.map((record) => {
          return record.quideSequence;
        });
        const sameGuideOrder = samples.every((sample, i) => {
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
        let header = 'sgRNA\tgENE\t';
        header += controls.map((control) => {
          return `C.${control}`;
        }).join('\t');
        header += '\t';
        header += replicates.map((replicate) => {
          return `R.${replicate}`;
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
      const writeInOrder = (guides, header, sampleIds) => {
        const file = fs.createWriteStream(`${folder}/samples.txt`);
        file.write(header);
        guides.forEach((guideEntry, i) => {
          let line = `${guideEntry.gene}_${guideEntry.guide}\t${guideEntry.gene}`;
          sampleIds.forEach((_id) => {
            const sampleIndex = samples.findIndex((sample) => {
              return sample._id === _id;
            });
            line += `\t${samples[sampleIndex].records[i].readCount}`;
          });
          line += '\n';
          file.write(line);
        });
        file.on('error', () => {
          reject('Input file could not be created');
        });
        file.end();
      };

      // write to file where samples do not have the same guide set
      const writeLineByLine = (guides, header, sampleIds) => {
        const file = fs.createWriteStream(`${folder}/samples.txt`);
        file.write(header);
        guides.forEach((guideEntry) => {
          let line = `${guideEntry.gene}_${guideEntry.guide}\t${guideEntry.gene}`;
          sampleIds.forEach((_id) => {
            const sampleIndex = samples.findIndex((sample) => {
              return sample._id === _id;
            });
            const recordIndex = samples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            line += recordIndex > -1 ?
              `\t${samples[sampleIndex].records[recordIndex].readCount}`
              :
              0
            ;
          });
          line += '\n';
          file.write(line);
        });
        file.on('error', () => {
          reject('Input file could not be created');
        });
        file.end();
      };

      // get list of controls and replicates
      let controls = [];
      const replicates = [];
      const replicateNames = [];
      design.forEach((sampleSet) => {
        sampleSet.controls.forEach((controlId) => {
          controls.push(controlId);
        });
        sampleSet.replicates.forEach((replicateId, index) => {
          replicates.push(replicateId);
          replicateNames.push(`${replicateId}.${index + 1}`);
        });
      });
      controls = Unique(controls);
      const allSampleIds = controls.concat(replicates);

      const header = createHeader(controls, replicateNames);
      const sameFormat = compareGuideOrder(allSampleIds);
      if (sameFormat) {
        const guides = getGuides([samples[0]]);
        writeInOrder(guides, header, allSampleIds);
      } else {
        const guides = getGuides(samples);
        writeLineByLine(guides, header, allSampleIds);
      }
      resolve();
    });
  },
  script: (fileName, task, params, writeLog) => {
    return new Promise((resolve, reject) => {
      // run mageck script
      const mageck = () => {
        return new Promise((resolveMageck, rejectMageck) => {
          // create args array
          const args = [
            'mle',
            '-k',
            `${task.folder}/${fileName}`,
            '-d',
            `${task.folder}/designfile.tsv`,
            '-n',
            `${task.folder}/mageck_mle`,
            '--norm-method',
            'none',
            '--genes-varmodeling',
            `${params.genesVarModeling}`,
            '--permutation-round',
            `${params.permutationRounds}`,
          ];
          // optional args
          if (params.adjustMethod) {
            args.push('--adjust-method');
            args.push(params.adjustMethod);
          }
          if (params.removeOutliers) {
            args.push('--remove-outliers');
          }
          writeLog(task.folder, `${config.scripts.MAGeCK} ${args.join(' ')}`);

          const mageckProcess = spawn(
            `${config.scriptPath}CRISPR/MAGeCK/${config.scripts.MAGeCK}`,
            args
          );
          let taskStatus = {
            pid: mageckProcess.pid,
            status: 'Starting MAGeCK',
            step: 'MAGeCK',
          };
          UpdateTask.sync(task.id, taskStatus);
          mageckProcess.stdout.on('data', (data) => {
            // log stdout, if any
            writeLog(task.folder, data);
          });
          mageckProcess.on('error', (processError) => {
            rejectMageck(processError);
          });
          mageckProcess.on('exit', () => {
            Promise.all([
              fs.readFile(`${task.folder}/mageck_mle.log`),
              fs.access(`${task.folder}/mageck_mle.gene_summary.txt`),
            ])
              .then((values) => {
                taskStatus = {
                  pid: 'x',
                  status: 'Complete',
                };
                return Promise.all([
                  writeLog(task.folder, values[0]),
                  UpdateTask.async(task.id, taskStatus),
                ]);
              })
              .then(() => {
                resolveMageck();
              })
              .catch((accessError) => {
                rejectMageck(accessError);
              })
            ;
          });
        });
      };

      mageck()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  storeOutput: (design, task) => {
    return new Promise((resolve, reject) => {
      // map sample set names
      const mappedSampleNames = {};
      design.forEach((sampleSet) => {
        mappedSampleNames[sampleSet.name.replace(/[^A-Za-z0-9._-]/g, '_')] = sampleSet.name;
      });

      // file options
      const csvParams = {
        delimiter: '\t',
        trim: true,
      };

      // convert csv file to JSON
      const csvToJson = () => {
        return new Promise((resolveCSV, rejectCSV) => {
          const jsonArray = [];
          csv(csvParams).fromFile(`${task.folder}/mageck_mle.gene_summary.txt`)
            .on('json', (jsonObj) => {
              jsonArray.push(jsonObj);
            })
            .on('done', (error) => {
              if (!error) {
                resolveCSV(jsonArray);
              } else {
                rejectCSV(error);
              }
            })
          ;
        });
      };

      // format JSON for DB insert
      const formatSamples = (json) => {
        const formattedResults = json.map((row) => {
          const sampleSetResults = {};
          Object.entries(row).forEach(([column, columnValue]) => {
            if (
              column !== 'Gene' &&
              column !== 'sgRNA'
            ) {
              const re = /(.*)\|([^|]*$)/;
              const matches = column.match(re);
              const columnName = matches[2];
              const columnSampleName = matches[1];
              if (!Object.prototype.hasOwnProperty.call(sampleSetResults, columnSampleName)) {
                sampleSetResults[columnSampleName] = {
                  sgRNA: row.sgRNA,
                };
              }
              sampleSetResults[columnSampleName][columnName] = Number(columnValue);
            }
          });
          return {
            gene: row.Gene,
            records: Object.entries(sampleSetResults).map(([sampleName, entry]) => {
              return Object.assign(
                {},
                entry,
                {
                  sampleSet: mappedSampleNames[sampleName],
                }
              );
            }),
          };
        });
        return ArraySort.arrayOfObjectByKey(formattedResults, 'gene');
      };

      csvToJson()
        .then((json) => {
          const formattedResults = formatSamples((json));
          return create.insert('analysisResults', { _id: task.id, results: formattedResults });
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
module.exports = MAGeCK;
