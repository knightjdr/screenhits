const AnalysisModule = {
  CRISPR: {
    options: [
      'BAGEL',
      'drugZ',
      'generic',
      'MAGeCKmle',
      'MAGeCKtest',
      'RANKS',
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
          name: 'bootstrapIter',
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
    drugZ: {
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
          defaultValue: 5,
          element: 'TextField',
          helpText: `Read count to add to all observations. The read count for
            every guide measurment will be supplemented by this many reads.`,
          inputType: 'number',
          name: 'pseudoCount',
          layName: 'pseudocount',
        },
        {
          defaultValue: 'v1',
          element: 'SelectField',
          helpText: `The version number of the non-essential gene
            list to use.`,
          name: 'nonEssentialVersion',
          layName: 'Non-essential gene list',
          options: [
            {
              name: 'Version 1',
              value: 'v1',
            },
          ],
        },
        {
          defaultValue: 'chr10, EGFP, LacZ , luciferase',
          element: 'TextField',
          helpText: `Control genes to remove from analysis. These must be entered as a
            comma-separated list of gene names, eg. 'luciferase, chr10, etc'`,
          inputType: 'text',
          name: 'removeGenes',
          layName: 'Control genes',
        },
      ],
    },
    generic: {
      parameters: [
        {
          element: 'SelectField',
          helpText: `The readout to use. Each readout name will appear as a row on
          the heat map.`,
          name: 'readout',
          layName: 'Readout',
          options: [],
        },
        {
          element: 'SelectField',
          helpText: 'The value to visualize on the heat map.',
          name: 'metric',
          layName: 'Metric',
          options: [],
        },
        {
          defaultValue: false,
          element: 'CheckBox',
          helpText: 'Specify whether samples should be normalized',
          name: 'norm',
          layName: 'Normalization',
        },
        {
          defaultValue: '',
          element: 'TextField',
          helpText: `Normalize chosen readout to this value. If this is not specified
          and normalization has been selected, the median of the summed readout (across
          samples) will be used.`,
          inputType: 'number',
          name: 'normCount',
          layName: 'Normalization value',
        },
      ],
    },
    MAGeCKmle: {
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
          helpText: 'The number of genes for mean-variance modeling.',
          inputType: 'number',
          name: 'genesVarModeling',
          layName: 'Genes for variance modeling',
        },
        {
          defaultValue: 10,
          element: 'TextField',
          helpText: `The rounds for permutation. The permutation time is
            (# genes) * x for x rounds of permutation. Suggested value:
            100 (may take longer time). Default 10.`,
          inputType: 'number',
          name: 'permutationRounds',
          layName: 'Permutation rounds',
        },
        {
          defaultValue: false,
          element: 'CheckBox',
          helpText: `Try to remove outliers. Turning this option on will slow
            the algorithm.`,
          name: 'removeOutliers',
          layName: 'Remove outliers',
        },
        {
          element: 'SelectField',
          helpText: 'Method for sgRNA-level p-value adjustment',
          name: 'adjustMethod',
          layName: 'p-value adjustment',
          options: [
            {
              name: 'FDR',
              value: 'fdr',
            },
            {
              name: "Holm's",
              value: 'holm',
            },
            {
              name: "Pound's",
              value: 'pounds',
            },
            {
              name: 'None',
              value: 'unselect',
            },
          ],
        },
      ],
    },
    MAGeCKtest: {
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
          defaultValue: 0.25,
          element: 'TextField',
          helpText: `FDR threshold for gene test. See
            https://sourceforge.net/p/mageck/wiki/usage/#test for more.`,
          inputType: 'number',
          name: 'geneTestFdrThreshold',
          layName: 'FDR threshold',
        },
        {
          element: 'SelectField',
          helpText: 'Method for sgRNA-level p-value adjustment',
          name: 'adjustMethod',
          layName: 'p-value adjustment',
          options: [
            {
              name: 'FDR',
              value: 'fdr',
            },
            {
              name: "Holm's",
              value: 'holm',
            },
            {
              name: "Pound's",
              value: 'pounds',
            },
            {
              name: 'None',
              value: 'unselect',
            },
          ],
        },
        {
          defaultValue: false,
          element: 'CheckBox',
          helpText: `Estimate the variance from all samples, instead of from only
            control samples. Use this option only if you believe there are relatively
            few essential sgRNAs or genes between control and treatment samples.`,
          name: 'varianceFromAllSamples',
          layName: 'Est. variance from all samples',
        },
        {
          defaultValue: 'median',
          element: 'SelectField',
          helpText: `Method to calculate gene log fold changes (LFC) from sgRNA LFCs.
            See https://sourceforge.net/p/mageck/wiki/usage/#test for more.`,
          name: 'geneLfcMethod',
          layName: 'Gene LFC method',
          options: [
            {
              name: '𝛂-mean',
              value: 'alphamean',
            },
            {
              name: '𝛂-median',
              value: 'alphamedian',
            },
            {
              name: 'mean',
              value: 'mean',
            },
            {
              name: 'median',
              value: 'median',
            },
            {
              name: 'secondbest',
              value: 'secondbest',
            },
          ],
        },
      ],
    },
    RANKS: {
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
          defaultValue: '',
          element: 'TextField',
          helpText: `By default RANKS will use all guides in your sample for
            modeling baseline behaviour, i.e. what would be expected to happen
            for a guide that has no effect on cell growth. Alternatively you can
            specify a list of control genes. These must be entered as a
            comma-separated list of gene names, eg. 'luciferase, chr10, etc'.`,
          inputType: 'text',
          name: 'controlGenes',
          layName: 'Control genes',
        },
      ],
    },
  },
};
export default AnalysisModule;
