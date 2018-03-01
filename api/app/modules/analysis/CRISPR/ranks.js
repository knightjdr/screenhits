const ArrayUnique = require('../../helpers/array-unique');
const create = require('../../crud/create');
const config = require('../../../../config').settings();
const CrisprDefaults = require('../CRISPR/crispr-defaults');
const fs = require('mz/fs');
const Log = require('../log');
const Mean = require('../../helpers/mean');
const Params = require('./params');
const Round = require('../../helpers/round');
const spawn = require('child_process').spawn;
const UpdateTask = require('../update-task');

const RANKS = {
  controlDist: (task, writeLog) => {
    return new Promise((resolve, reject) => {
      const ranksProcess = spawn(
        `${config.scriptPath}CRISPR/RANKS/${config.scripts.RANKScontrolDist}`,
        [
          '-p',
          `${task.folder}`,
        ]
      );
      let taskStatus = {
        pid: ranksProcess.pid,
        status: 'generating control distribution',
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
        fs.access(`${task.folder}/ctrlscores10`)
          .then(() => {
            taskStatus = {
              pid: 'x',
              status: 'Complete',
            };
            return UpdateTask.async(task.id, taskStatus);
          })
          .then(() => {
            resolve();
          })
          .catch((accessError) => {
            reject(accessError);
          })
        ;
      });
    });
  },
  normalizeAndFilter: (sampleSet, task, params, writeLog) => {
    return new Promise((resolve, reject) => {
      const numFiles = sampleSet.length;

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
            taskStatus = {
              pid: 'x',
              status: 'Complete',
            };
            UpdateTask.async(task.id, taskStatus)
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

      const next = (index) => {
        const fileName = `${sampleSet[index].name}.txt`;
        normalize(fileName)
          .then(() => {
            if (index < numFiles - 1) {
              next(index + 1);
            } else {
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          })
        ;
      };
      next(0);
    });
  },
  readAndMerge: (sampleSet, output) => {
    const geneSetData = {};
    sampleSet.forEach((set) => {
      const neg = {};
      const pos = {};
      set.replicates.forEach((_id, index) => {
        output[set.name][index].forEach((geneResult) => {
          if (geneResult.score > 0) {
            if (!Object.prototype.hasOwnProperty.call(pos, geneResult.gene)) {
              pos[geneResult.gene] = {
                score: [],
                pValue: [],
                fdr: [],
                numGuides: [],
              };
            }
            pos[geneResult.gene].score.push(geneResult.score);
            pos[geneResult.gene].pValue.push(geneResult.pValue);
            pos[geneResult.gene].fdr.push(geneResult.fdr);
            pos[geneResult.gene].numGuides.push(geneResult.numGuides);
          } else {
            if (!Object.prototype.hasOwnProperty.call(neg, geneResult.gene)) {
              neg[geneResult.gene] = {
                score: [],
                pValue: [],
                fdr: [],
                numGuides: [],
              };
            }
            neg[geneResult.gene].score.push(geneResult.score);
            neg[geneResult.gene].pValue.push(geneResult.pValue);
            neg[geneResult.gene].fdr.push(geneResult.fdr);
            neg[geneResult.gene].numGuides.push(geneResult.numGuides);
          }
        });
      });
      const numReplicates = set.replicates.length;
      // average postive scores
      const avgPos = {};
      Object.keys(pos).forEach((gene) => {
        if (pos[gene].score.length === numReplicates) {
          avgPos[gene] = {
            score: Round(Mean(pos[gene].score), 3),
            pValue: Mean(pos[gene].pValue),
            fdr: Round(Mean(pos[gene].fdr), 3),
            numGuides: Round(Mean(pos[gene].numGuides), 3),
          };
        }
      });
      // average negative scores
      const avgNeg = {};
      Object.keys(neg).forEach((gene) => {
        if (neg[gene].score.length === numReplicates) {
          avgNeg[gene] = {
            score: Round(Mean(neg[gene].score), 3),
            pValue: Mean(neg[gene].pValue),
            fdr: Round(Mean(neg[gene].fdr), 3),
            numGuides: Round(Mean(neg[gene].numGuides), 3),
          };
        }
      });
      const genes = ArrayUnique(Object.keys(avgPos).concat(Object.keys(avgNeg)));
      genes.forEach((gene) => {
        const currGeneData = {
          sampleSet: set.name,
        };
        if (Object.prototype.hasOwnProperty.call(avgPos, gene)) {
          currGeneData['enrichment-score'] = avgPos[gene].score;
          currGeneData['enrichment-pValue'] = avgPos[gene].pValue;
          currGeneData['enrichment-fdr'] = avgPos[gene].fdr;
          currGeneData['enrichment-numGuides'] = avgPos[gene].numGuides;
        }
        if (Object.prototype.hasOwnProperty.call(avgNeg, gene)) {
          currGeneData['depletion-score'] = avgNeg[gene].score;
          currGeneData['depletion-pValue'] = avgNeg[gene].pValue;
          currGeneData['depletion-fdr'] = avgNeg[gene].fdr;
          currGeneData['depletion-numGuides'] = avgNeg[gene].numGuides;
        }
        if (!Object.prototype.hasOwnProperty.call(geneSetData, gene)) {
          geneSetData[gene] = [currGeneData];
        } else {
          geneSetData[gene].push(currGeneData);
        }
      });
    });
    return Object.keys(geneSetData).sort().map((gene) => {
      return {
        gene,
        records: geneSetData[gene],
      };
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
        RANKS.writeFiles(task.folder, details.design, details.controlGenes, formSamples),
        UpdateTask.async(task.id, taskStatus),
      ])
        .then(() => {
          // apply filters and normalization
          const initParams = Params.get(details, CrisprDefaults.all);
          return RANKS.normalizeAndFilter(
            details.design,
            task,
            initParams,
            writeLog
          );
        })
        .then(() => {
          return RANKS.controlDist(task, writeLog);
        })
        .then(() => {
          // run RANKS
          return RANKS.script(
            details.design,
            details.controlGenes,
            task,
            writeLog
          );
        })
        .then((output) => {
          const mergedResults = RANKS.readAndMerge(details.design, output);
          return Promise.all([
            Log.write(task),
            RANKS.storeOutput(mergedResults, task),
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
  script: (sampleSet, controlGenes, task) => {
    return new Promise((resolve, reject) => {
      // output
      const output = {};
      // run normalize script
      const ranks = (sampleSetName, replicate) => {
        return new Promise((resolveRANKS, rejectRANKS) => {
          let args = [
            `${task.folder}/filtered_C${replicate + 1}_${sampleSetName}.txt`,
            `${task.folder}/filtered_R${replicate + 1}_${sampleSetName}.txt`,
            '-lib',
            `${task.folder}/guides_${sampleSetName}.txt`,
            '-p',
            `${task.folder}/`,
          ];
          // check if user specified control genes and if a guide file was created
          if (
            controlGenes &&
            fs.statSync(`${task.folder}/controls_${sampleSetName}.txt`)
          ) {
            args = args.concat([
              '-ctrl',
              `${task.folder}/controls_${sampleSetName}.txt`,
            ]);
          }

          let stdout = '';
          const ranksProcess = spawn(
            `${config.scriptPath}CRISPR/RANKS/${config.scripts.RANKS}`,
            args
          );
          let taskStatus = {
            pid: ranksProcess.pid,
            status: 'Starting RANKS',
            step: 'RANKS',
          };
          UpdateTask.sync(task.id, taskStatus);
          ranksProcess.stdout.on('data', (data) => {
            stdout += data.toString();
          });
          ranksProcess.on('error', (processError) => {
            reject(processError);
          });
          ranksProcess.on('exit', () => {
            // parse stdout to JSON
            output[sampleSetName][replicate] = [];
            const data = stdout.split('\n');
            data.forEach((line, index) => {
              const lineArr = line.split('\t');
              if (
                index !== 0 &&
                lineArr[0]
              ) {
                output[sampleSetName][replicate].push({
                  gene: lineArr[0],
                  score: Number(lineArr[1]),
                  pValue: Number(lineArr[2]),
                  fdr: Number(lineArr[3]),
                  numGuides: Number(lineArr[4]),
                });
              }
            });
            // updat task status
            taskStatus = {
              pid: 'x',
              status: 'Complete',
            };
            UpdateTask.async(task.id, taskStatus)
              .then(() => {
                resolveRANKS();
              })
              .catch((accessError) => {
                rejectRANKS(accessError);
              })
            ;
          });
        });
      };

      // run sample set
      const runSampleSet = (set) => {
        return new Promise((resolveSampleSet, rejectSampleSet) => {
          // init output object for stdout
          output[set.name] = [];
          const nextSample = (index) => {
            ranks(set.name, index)
              .then(() => {
                if (index < set.controls.length - 1) {
                  nextSample(index + 1);
                } else {
                  resolveSampleSet();
                }
              })
              .catch((error) => {
                rejectSampleSet(error);
              })
            ;
          };
          nextSample(0);
        });
      };

      const nextSampleSet = (index) => {
        runSampleSet(sampleSet[index])
          .then(() => {
            if (index < sampleSet.length - 1) {
              nextSampleSet(index + 1);
            } else {
              resolve(output);
            }
          })
          .catch((error) => {
            reject(error);
          })
        ;
      };
      nextSampleSet(0);
    });
  },
  storeOutput: (data, task) => {
    return new Promise((resolve, reject) => {
      create.insert('analysisResults', { _id: task.id, results: data })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  writeFiles: (folder, design, controlGenes, samples) => {
    return new Promise((resolve, reject) => {
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

      // write control genes to a file (if specified)
      const writeControls = (guides, controls, sampleSet) => {
        return new Promise((resolveWriteControls, rejectWriteControls) => {
          if (controls) {
            // split user specified control string
            const controlGeneArray = controls.split(/, */);
            const guideSequences = [];
            // for each control gene, find matching guide sequences and write to file
            controlGeneArray.forEach((gene) => {
              const guideIndices = guides.reduce((arr, guideEntry, index) => {
                return guideEntry.gene === gene ? arr.concat(index) : arr;
              }, []);
              guideIndices.forEach((index) => {
                guideSequences.push(guides[index].guide);
              });
              if (guideSequences.length > 0) {
                const file = fs.createWriteStream(`${folder}/controls_${sampleSet.name}.txt`);
                guideSequences.forEach((sequence) => {
                  file.write(`${sequence}\n`);
                });
                file.on('error', () => {
                  rejectWriteControls(`Control file could not be created for sample ${sampleSet.name}`);
                });
                file.end();
                resolveWriteControls();
              } else {
                resolveWriteControls();
              }
            });
          } else {
            resolveWriteControls();
          }
        });
      };

      // write to file where samples have the same guide set
      const writeGuides = (guides, sampleSet) => {
        return new Promise((resolveGuideWrite, rejectGuideWrite) => {
          const file = fs.createWriteStream(`${folder}/guides_${sampleSet.name}.txt`);
          Object.entries(guides).forEach(([guide, gene]) => {
            file.write(`${guide}\t${gene}\n`);
          });
          file.on('error', () => {
            rejectGuideWrite(`Guide file could not be created for sample ${sampleSet.name}`);
          });
          file.end();
          resolveGuideWrite();
        });
      };

      // write to file where samples do not have the same guide set
      const writeToFile = (guides, header, sampleSet, currSamples) => {
        return new Promise((resolveFileWrite, rejectFileWrite) => {
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
            rejectFileWrite(`Input file could not be created from the database for sample ${sampleSet.name}`);
          });
          file.end();
          resolveFileWrite();
        });
      };

      const next = (index) => {
        const sampleSet = design[index];
        const currSamples = sampleSet.controls.concat(sampleSet.replicates).map((_id) => {
          const sampleIndex = samples.findIndex((sample) => { return sample._id === _id; });
          return samples[sampleIndex];
        });
        // write to file
        const header = createHeader(sampleSet.controls, sampleSet.replicates);
        const guides = getGuides(samples);
        Promise.all([
          writeControls(guides, controlGenes, sampleSet),
          writeGuides(guides, sampleSet),
          writeToFile(guides, header, sampleSet, currSamples),
        ])
          .then(() => {
            if (index < design.length - 1) {
              next(index + 1);
            } else {
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          })
        ;
      };
      next(0);
    });
  },
};
module.exports = RANKS;
