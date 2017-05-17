const Fields = {
  cell: {
    values: [
      'HEK293',
      'Hela',
    ],
  },
  condition: {
    help: 'Specificy the condition, drug or treatment used in the screen, if any.',
  },
  other: {
    CRISPR: [
      {
        help: 'Select the CRISPR library used for the screen.',
        helpTitle: 'Help from the "Library" field.',
        name: 'library',
        options: [
          'tko v1 Base library',
          'tko v2 Base library',
        ],
        required: true,
        type: 'select',
      },
      {
        name: 'approach',
        options: [
          'Negative selection',
          'Positive selection',
        ],
        required: true,
        type: 'select',
      },
    ],
    Microscopy: [],
  },
  species: {
    values: [
      'Homo sapiens',
      'Mus musculus',
    ],
  },
  type: {
    values: [
      'CRISPR',
      'Microscopy',
    ],
  },
};
export default Fields;
