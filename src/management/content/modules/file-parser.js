// contains rules for parsing sample files

const fileParser = {
  CRISPR: [
    {
      delimiter: '\t',
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
          type: 'metric',
        },
        {
          name: 'gene',
          index: 1,
          type: 'metric',
        },
      ],
      name: 'tab-separated text file with read counts',
      type: 'text/tab-separated-values',
    },
  ],
};

export default fileParser;
