const AnalysisModule = {
  CRISPR: {
    options: [
      'BAGEL',
      'drugZ',
      'generic',
      'MAGeCK',
      'RANKs',
    ],
    BAGEL: {
      parameters: [
        {
          defaultValue: 30,
          element: 'TextField',
          helpText: `The mimimum number of guides that must be found in all control
            samples to be included in the analysis.`,
          inputType: 'number',
          name: 'minReadCount',
          layName: 'Minimum read count',
        },
        {
          defaultValue: 4,
          element: 'TextField',
          helpText: `The minimum number of guides per gene that must pass the
            read count cutoff for a gene to be included in the analysis.`,
          inputType: 'number',
          name: 'minGuides',
          layName: 'Minimum number of guides',
        },
        {
          defaultValue: true,
          element: 'CheckBox',
          helpText: 'Specify whether samples should be normalized',
          name: 'norm',
          layName: 'Normalization',
        },
        {
          defaultValue: 10000000,
          element: 'TextField',
          helpText: `Read counts will be nomalized to this value. The value
            will not affect the analysis. It is a way of ensuring read count
            values are on a similar scale across samples and experiments.`,
          inputType: 'number',
          name: 'normCount',
          layName: 'Normalization read count',
        },
        {
          defaultValue: 1000,
          element: 'TextField',
          helpText: `The number of iterations to resample and recalculate the
            bagel statistic.`,
          inputType: 'number',
          name: 'boostrapIter',
          layName: 'Bootstrap iterations',
        },
        {
          defaultValue: 'v1',
          element: 'SelectField',
          helpText: `The version number of the essential and non-essential gene
            lists to use.`,
          name: 'essentialVersion',
          layName: 'Essential/non-essential gene list',
          options: [
            {
              name: 'Version 1',
              value: 'v1',
            },
          ],
        },
      ],
    },
    generic: {
    },
  },
};
export default AnalysisModule;
