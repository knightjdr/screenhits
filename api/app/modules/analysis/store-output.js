const create = require('../crud/create');
const csv = require('csvtojson');
const query = require('../query/query');

const StoreOutput = {
  BAGEL: (task) => {
    return new Promise((resolve, reject) => {
      // file options
      const csvParams = {
        delimiter: '\t',
        trim: true,
      };
      const columns = {
        gene: 'GENE',
        other: ['BF', 'STD', 'NumObs'],
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
  readFiles: (columns, options, setNames, task) => {
    return new Promise((resolve, reject) => {
      const results = {};
      const setNumber = setNames.length;

      // convert csv file to JSON
      const csvToJson = (fullPath) => {
        return new Promise((resolveCSV, rejectCSV) => {
          const jsonArray = [];
          csv(options).fromFile(fullPath)
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

      // format JSON results
      const formatJSON = (json, name) => {
        json.forEach((row) => {
          const currGene = row[columns.gene];
          const currFields = {
            sampleSet: name,
          };
          columns.other.forEach((key) => {
            currFields[key] = row[key];
          });
          if (Object.prototype.hasOwnProperty.call(results, currGene)) {
            results[currGene].push(currFields);
          } else {
            results[currGene] = [currFields];
          }
        });
      };

      // format results
      const formatResults = () => {
        const formattedResults = [];
        Object.keys(results).forEach((gene) => {
          formattedResults.push({
            gene,
            records: results[gene],
          });
        });
        return formattedResults;
      };

      // next iterator
      const next = (set, index) => {
        const fullPath = `${task.folder}/${set.file}`;
        csvToJson(fullPath)
          .then((json) => {
            formatJSON(json, set.name);
            if (index < setNumber - 1) {
              next(setNames[index], index + 1);
            } else {
              resolve(formatResults());
            }
          })
          .catch((error) => {
            reject(error);
          })
        ;
      };
      next(setNames[0], 0);
    });
  },
};
module.exports = StoreOutput;
