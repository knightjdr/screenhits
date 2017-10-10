// contains rules for parsing sample files

const fileParser = {
  CRISPR: [
    {
      delimiter: 'tsv',
      firstLine: {
        toParse: [
          0,
        ],
        regex: [
          {
            keep: 1,
            pattern: /.+_(.+)/,
          },
        ],
      },
      header: [
        {
          name: 'guideSequence',
          index: 0,
          layName: 'guide sequence',
          type: 'readout',
        },
        {
          name: 'gene',
          index: 1,
          layName: 'gene identifier',
          type: 'readout',
        },
      ],
      mandatory: [
        {
          matched: false,
          name: 'readCount',
          layName: ' read count',
          type: 'metric',
        },
      ],
      name: 'tab-separated text file with read counts',
      type: 'text/tab-separated-values',
    },
  ],
  Generic: [
    {
      delimiter: 'tsv',
      firstLine: {
        toParse: [],
        regex: [],
      },
      header: [],
      mandatory: [],
      name: 'tab-separated text file',
      type: 'text/tab-separated-values',
    },
    {
      delimiter: 'csv',
      firstLine: {
        toParse: [],
        regex: [],
      },
      header: [],
      mandatory: [],
      name: 'comma-separated text file',
      type: 'text/csv',
    },
  ],
  Microscopy: [
    {
      name: 'image',
      type: 'text/tab-separated-values',
    },
  ],
};

export default fileParser;
