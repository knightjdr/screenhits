const FormatTask = {
  CRISPR: {
    BAGEL: (task) => {
      return new Promise((resolve) => {
        const headers = task.status.details.design.map((sampleSet) => {
          return sampleSet.name;
        });
        const range = {
          max: 0,
          min: 0,
        };
        const results = task.results.map((row) => {
          const columns = [];
          headers.forEach((header) => {
            const recordIndex = row.records.findIndex((record) => {
              return record.sampleSet === header;
            });
            let currColumn = {};
            if (recordIndex > -1) {
              const currRow = row.records[recordIndex];
              if (currRow.BF > range.max) {
                range.max = currRow.BF;
              } else if (currRow.BF < range.min) {
                range.min = currRow.BF;
              }
              currColumn = {
                value: currRow.BF,
                tooltip: {
                  BF: currRow.BF,
                  STD: currRow.STD,
                  NumObs: currRow.NumObs,
                },
              };
            } else {
              currColumn = {
                value: 0,
                tooltip: {
                  text: 'Gene not present in sample set',
                },
              };
            }
            columns.push(currColumn);
          });
          return {
            name: row.gene,
            columns,
          };
        });
        resolve({
          header: headers,
          legend: {
            valueName: 'BF',
          },
          range,
          results,
        });
      });
    },
  },
};

module.exports = FormatTask;
