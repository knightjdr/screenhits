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
                'BF-filters': {
                  numObs: currRow.NumObs,
                  STD: currRow.STD,
                },
                tooltip: {
                  BF: currRow.BF,
                  STD: currRow.STD,
                  NumObs: currRow.NumObs,
                },
              };
            } else {
              currColumn = {
                BF: 0,
                'BF-filters': {
                  numObs: 0,
                  STD: 0,
                },
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
            filters: {
              BF: [
                {
                  name: 'numObs',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'STD',
                  type: 'gte',
                  value: null,
                },
              ],
            },
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
    drugZ: (task) => {
      return new Promise((resolve) => {
        const headers = task.status.details.design.map((sampleSet) => {
          return sampleSet.name;
        });
        const range = {
          normZ: {
            max: 0,
            min: 0,
          },
          sumZ: {
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
              if (currRow.normZ > range.normZ.max) {
                range.normZ.max = currRow.normZ;
              } else if (currRow.normZ < range.normZ.min) {
                range.normZ.min = currRow.normZ;
              }
              if (currRow.sumZ > range.sumZ.max) {
                range.sumZ.max = currRow.sumZ;
              } else if (currRow.sumZ < range.sumZ.min) {
                range.sumZ.min = currRow.sumZ;
              }
              currColumn = {
                normZ: currRow.normZ,
                'normZ-filters': {
                  numObs: currRow.numObs,
                  pValueSynth: currRow.pval_synth,
                  rankSynth: currRow.rank_synth,
                  fdrSynth: currRow.fdr_synth,
                  pValueSupp: currRow.pval_supp,
                  rankSupp: currRow.rank_supp,
                  fdrSupp: currRow.fdr_supp,
                },
                sumZ: currRow.sumZ,
                'sumZ-filters': {
                  numObs: currRow.numObs,
                },
                tooltip: {
                  normZ: currRow.normZ,
                  sumZ: currRow.sumZ,
                  numObs: currRow.numObs,
                  pValueSynth: currRow.pval_synth,
                  rankSynth: currRow.rank_synth,
                  fdrSynth: currRow.fdr_synth,
                  pValueSupp: currRow.pval_supp,
                  rankSupp: currRow.rank_supp,
                  fdrSupp: currRow.fdr_supp,
                },
              };
            } else {
              currColumn = {
                normZ: 0,
                'normZ-filters': {
                  numObs: 0,
                  pValueSynth: 0,
                  rankSynth: 0,
                  fdrSynth: 1,
                  pValueSupp: 0,
                  rankSupp: 0,
                  fdrSupp: 1,
                },
                sumZ: 0,
                'sumZ-filters': {
                  numObs: 0,
                },
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
              normZ: 'normalized Z-score',
              sumZ: 'summed Z-score',
            },
          },
          options: {
            filters: {
              normZ: [
                {
                  name: 'numObs',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'pValueSynth',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'rankSynth',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'fdrSynth',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'pValueSupp',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'rankSupp',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'fdrSupp',
                  type: 'lte',
                  value: null,
                },
              ],
              sumZ: [
                {
                  name: 'numObs',
                  type: 'gte',
                  value: null,
                },
              ],
            },
            valueName: [
              {
                text: 'normalized Z-score',
                value: 'normZ',
              },
              {
                text: 'summed Z-score',
                value: 'sumZ',
              },
            ],
          },
          range,
          results,
        });
      });
    },
    MAGeCKmle: (task) => {
      return new Promise((resolve) => {
        const headers = task.status.details.design.map((sampleSet) => {
          return sampleSet.name;
        });
        const range = {
          beta: {
            max: 0,
            min: 0,
          },
          z: {
            max: 0,
            min: 0,
          },
        };
        console.log(task.results);
        const results = task.results.map((row) => {
          const columns = [];
          headers.forEach((header) => {
            const recordIndex = row.records.findIndex((record) => {
              return record.sampleSet === header;
            });
            let currColumn = {};
            if (recordIndex > -1) {
              const currRow = row.records[recordIndex];
              if (currRow.beta > range.beta.max) {
                range.beta.max = currRow.beta;
              } else if (currRow.beta < range.beta.min) {
                range.beta.min = currRow.beta;
              }
              if (currRow.z > range.z.max) {
                range.z.max = currRow.z;
              } else if (currRow.z < range.z.min) {
                range.z.min = currRow.z;
              }
              currColumn = {
                beta: currRow.beta,
                'beta-filters': {
                  pValue: currRow['p-value'],
                  FDR: currRow.fdr,
                  numGuides: currRow.sgRNA,
                  waldpValue: currRow['wald-p-value'],
                  waldFDR: currRow['wald-fdr'],
                },
                z: currRow.z,
                'z-filters': {
                  pValue: currRow['p-value'],
                  FDR: currRow.fdr,
                  numGuides: currRow.sgRNA,
                  waldpValue: currRow['wald-p-value'],
                  waldFDR: currRow['wald-fdr'],
                },
                tooltip: {
                  beta: currRow.beta,
                  z: currRow.z,
                  pValue: currRow['p-value'],
                  FDR: currRow.fdr,
                  numGuides: currRow.sgRNA,
                  waldpValue: currRow['wald-p-value'],
                  waldFDR: currRow['wald-fdr'],
                },
              };
            } else {
              currColumn = {
                beta: 0,
                'beta-filters': {
                  pValue: 0,
                  FDR: 1,
                  numGuides: 0,
                  waldpValue: 0,
                  waldFDR: 1,
                },
                z: 0,
                'z-filters': {
                  pValue: 0,
                  FDR: 1,
                  numGuides: 0,
                  waldpValue: 0,
                  waldFDR: 1,
                },
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
              beta: 'beta score',
              z: 'z score',
            },
          },
          options: {
            filters: {
              beta: [
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'FDR',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'waldpValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'waldFDR',
                  type: 'lte',
                  value: null,
                },
              ],
              z: [
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'FDR',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'waldpValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'waldFDR',
                  type: 'lte',
                  value: null,
                },
              ],
            },
            valueName: [
              {
                text: 'beta score',
                value: 'beta',
              },
              {
                text: 'z score',
                value: 'z',
              },
            ],
          },
          range,
          results,
        });
      });
    },
    MAGeCKtest: (task) => {
      return new Promise((resolve) => {
        const headers = task.status.details.design.map((sampleSet) => {
          return sampleSet.name;
        });
        const range = {
          'neg|score': {
            max: 0,
            min: 0,
          },
          'pos|score': {
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
              if (currRow['neg|score'] > range['neg|score'].max) {
                range['neg|score'].max = currRow['neg|score'];
              } else if (currRow['neg|score'] < range['neg|score'].min) {
                range['neg|score'].min = currRow['neg|score'];
              }
              if (currRow['pos|score'] > range['pos|score'].max) {
                range['pos|score'].max = currRow['pos|score'];
              } else if (currRow['pos|score'] < range['pos|score'].min) {
                range['pos|score'].min = currRow['pos|score'];
              }
              currColumn = {
                'neg|score': currRow['neg|score'],
                'neg|score-filters': {
                  pValue: currRow['neg|p-value'],
                  fdr: currRow['neg|fdr'],
                  rank: currRow['neg|rank'],
                  goodsgrna: currRow['neg|goodsgrna'],
                  lfc: currRow['neg|lfc'],
                  numGuides: currRow.num,
                },
                'pos|score': currRow['pos|score'],
                'pos|score-filters': {
                  pValue: currRow['pos|p-value'],
                  fdr: currRow['pos|fdr'],
                  rank: currRow['pos|rank'],
                  goodsgRNA: currRow['pos|goodsgrna'],
                  LFC: currRow['pos|lfc'],
                  numGuides: currRow.num,
                },
                tooltip: {
                  'depletion-score': currRow['neg|score'],
                  'depletion-pValue': currRow['neg|p-value'],
                  'depletion-fdr': currRow['neg|fdr'],
                  'depletion-rank': currRow['neg|rank'],
                  'depletion-goodsgRNA': currRow['neg|goodsgrna'],
                  'depletion-LFC': currRow['neg|lfc'],
                  'enrichment-score': currRow['pos|score'],
                  'enrichment-pValue': currRow['pos|p-value'],
                  'enrichment-fdr': currRow['pos|fdr'],
                  'enrichment-rank': currRow['pos|rank'],
                  'enrichment-goodsgRNA': currRow['pos|goodsgrna'],
                  'enrichment-LFC': currRow['pos|lfc'],
                  numGuides: currRow.num,
                },
              };
            } else {
              currColumn = {
                'neg|score': 0,
                'neg|score-filters': {
                  pValue: 0,
                  fdr: 1,
                  rank: 0,
                  goodsgrna: 0,
                  lfc: 0,
                  numGuides: 0,
                },
                'pos|score': 0,
                'pos|score-filters': {
                  pValue: 0,
                  fdr: 1,
                  rank: 0,
                  goodsgRNA: 0,
                  LFC: 0,
                  numGuides: 0,
                },
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
              'neg|score': 'sgRNA depletion',
              'pos|score': 'sgRNA enrichment',
            },
          },
          options: {
            filters: {
              'neg|score': [
                {
                  name: 'fdr',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'goodsgRNA',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'lfc',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'rank',
                  type: 'lte',
                  value: null,
                },
              ],
              'pos|score': [
                {
                  name: 'fdr',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'goodsgRNA',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'lfc',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'rank',
                  type: 'lte',
                  value: null,
                },
              ],
            },
            valueName: [
              {
                text: 'sgRNA enrichment',
                value: 'pos|score',
              },
              {
                text: 'sgRNA depletion',
                value: 'neg|score',
              },
            ],
          },
          range,
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
                'depletion-score-filters': {
                  pValue: currRow['depletion-pValue'],
                  fdr: currRow['depletion-fdr'],
                  numGuides: currRow['depletion-numGuides'],
                },
                'enrichment-score': currRow['enrichment-score'],
                'enrichment-score-filters': {
                  pValue: currRow['enrichment-pValue'],
                  fdr: currRow['enrichment-fdr'],
                  numGuides: currRow['enrichment-numGuides'],
                },
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
                'depletion-score-filters': {
                  pValue: 0,
                  fdr: 1,
                  numGuides: 0,
                },
                'enrichment-score': 0,
                'enrichment-score-filters': {
                  pValue: 0,
                  fdr: 1,
                  numGuides: 0,
                },
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
            filters: {
              'depletion-score': [
                {
                  name: 'fdr',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
              ],
              'enrichment-score': [
                {
                  name: 'fdr',
                  type: 'lte',
                  value: null,
                },
                {
                  name: 'numGuides',
                  type: 'gte',
                  value: null,
                },
                {
                  name: 'pValue',
                  type: 'lte',
                  value: null,
                },
              ],
            },
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
