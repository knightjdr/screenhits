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
                BF: currRow.BF,
                tooltip: {
                  BF: currRow.BF,
                  STD: currRow.STD,
                  NumObs: currRow.NumObs,
                },
              };
            } else {
              currColumn = {
                BF: 0,
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
            valueName: {
              BF: 'Bagel factor',
            },
          },
          options: {
            valueName: [
              {
                text: 'Bagel factor',
                value: 'BF',
              },
            ],
          },
          range: {
            BF: range,
          },
          results,
        });
      });
    },
    RANKS: (task) => {
      return new Promise((resolve) => {
        const headers = task.status.details.design.map((sampleSet) => {
          return sampleSet.name;
        });
        const range = {
          'depletion-score': {
            max: 0,
            min: 0,
          },
          'enrichment-score': {
            max: 0,
            min: 0,
          },
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
              if (currRow['depletion-score'] > range['depletion-score'].max) {
                range['depletion-score'].max = currRow['depletion-score'];
              } else if (currRow['depletion-score'] < range['depletion-score'].min) {
                range['depletion-score'].min = currRow['depletion-score'];
              }
              if (currRow['enrichment-score'] > range['enrichment-score'].max) {
                range['enrichment-score'].max = currRow['enrichment-score'];
              } else if (currRow['enrichment-score'] < range['enrichment-score'].min) {
                range['enrichment-score'].min = currRow['enrichment-score'];
              }
              currColumn = {
                'depletion-score': currRow['depletion-score'],
                'depletion-score-pValue': currRow['depletion-pValue'],
                'depletion-score-fdr': currRow['depletion-fdr'],
                'depletion-score-numGuides': currRow['depletion-numGuides'],
                'enrichment-score': currRow['enrichment-score'],
                'enrichment-score-pValue': currRow['enrichment-pValue'],
                'enrichment-score-fdr': currRow['enrichment-fdr'],
                'enrichment-score-numGuides': currRow['enrichment-numGuides'],
                tooltip: {
                  'depletion-score': currRow['depletion-score'],
                  'depletion-pValue': currRow['depletion-pValue'].toExponential(3),
                  'depletion-fdr': currRow['depletion-fdr'],
                  'depletion-numGuides': currRow['depletion-numGuides'],
                  'enrichment-score': currRow['enrichment-score'],
                  'enrichment-pValue': currRow['enrichment-pValue'].toExponential(3),
                  'enrichment-fdr': currRow['enrichment-fdr'],
                  'enrichment-numGuides': currRow['enrichment-numGuides'],
                },
              };
            } else {
              currColumn = {
                'depletion-score': 0,
                'depletion-score-pValue': 0,
                'depletion-score-fdr': 0,
                'depletion-score-numGuides': 0,
                'enrichment-score': 0,
                'enrichment-score-pValue': 0,
                'enrichment-score-fdr': 0,
                'enrichment-score-numGuides': 0,
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
            valueName: {
              'depletion-score': 'sgRNA depletion',
              'enrichment-score': 'sgRNA enrichment',
            },
          },
          options: {
            filters: [
              {
                name: 'fdr',
                type: 'lte',
                value: 0.4,
              },
              {
                name: 'numGuides',
                type: 'gte',
                value: 4,
              },
              {
                name: 'pValue',
                type: 'lte',
                value: undefined,
              },
            ],
            valueName: [
              {
                text: 'sgRNA enrichment',
                value: 'enrichment-score',
              },
              {
                text: 'sgRNA depletion',
                value: 'depletion-score',
              },
            ],
          },
          range,
          results,
        });
      });
    },
  },
};

module.exports = FormatTask;
