const arrayUnique = require('../helpers/array-unique');
const config = require('../../../config').settings();
const CrisprDefaults = require('./CRISPR/crispr-defaults');
const fs = require('mz/fs');
const query = require('../query/query');
const samplesToFiles = require('./CRISPR/samples-to-files');
const spawn = require('child_process').spawn;

const Pipeline = {
  CRISPR: {
    init: (analysisDetails, folder) => {
      return new Promise((resolve) => {
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
        query.get('sample', { _id: { $in: sampleIDs } }, { records: 1 })
          .then((samples) => {
            // write samples to files based on design
            return samplesToFiles.fromDatabase(folder, analysisDetails.design, samples);
          })
          .then((fileNames) => {
            // apply filters and normalization
            const initParams = getInitParams(analysisDetails, CrisprDefaults.all);
            return Pipeline.CRISPR.normalizeAndFilter(fileNames, folder, initParams);
          })
          .then(() => {
            // run type specific pipeline
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
          })
        ;
      });
    },
    normalizeAndFilter: (fileNames, folder, params) => {
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
                `${folder}/`,
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
            normalizeProcess.stdout.on('data', (data) => {
              //log data
            });
            normalizeProcess.on('error', (processError) => {
              reject(processError);
            });
            normalizeProcess.on('exit', (processError) => {
              console.log(processError);
              fs.access(`${folder}/filtered_${fileName}`)
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

        const outFileNames = [];
        const next = (fileName, index) => {
          normalize(fileName)
            .then((outFileName) => {
              outFileNames.push(outFileName);
              if (index < numFiles - 1) {
                next(fileNames, index + 1);
              } else {
                resolve();
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
