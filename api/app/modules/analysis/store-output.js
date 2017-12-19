const csv = require('csvtojson');

const StoreOutput = {
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
          columns.other.forEach((field) => {
            currFields[field.name] = isNaN(row[field.name]) ?
              row[field.name]
              :
              Number(row[field.name])
            ;
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
              next(setNames[index + 1], index + 1);
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
