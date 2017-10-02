const Fields = {
  cell: {
    values: [
      'HEK 293',
      'Hela',
    ],
  },
  condition: {
    help: 'Specificy the condition, drug or treatment used in the screen, if any.',
  },
  other: {
    CRISPR: [
      {
        defaultError: null,
        defaultValue: null,
        help: 'Select the CRISPR library used for the screen.',
        helpTitle: 'Help from the "Library" field.',
        name: 'library',
        options: [
          'tko v1 Base library',
          'tko v2 Base library',
        ],
        type: 'select',
      },
      {
        defaultError: null,
        defaultValue: null,
        name: 'approach',
        options: [
          'Negative selection',
          'Positive selection',
        ],
        type: 'select',
      },
    ],
    Generic: [],
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
      'Generic',
      'Microscopy',
    ],
  },
};
export default Fields;
