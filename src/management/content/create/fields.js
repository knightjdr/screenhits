const Fields = {
  screen: {
    cell: {
      values: [
        'HEK293',
        'Hela',
      ],
    },
    condition: {
      help: 'Specificy the condition, drug or treatment used in the screen, if any',
    },
    other: {
      CRISPR: [
        {
          name: 'library',
          options: [
            'tko v1 Base library',
            'tko v2 Base library',
          ],
          type: 'select',
        },
        {
          name: 'approach',
          options: [
            'Negative selection',
            'Positive selection',
          ],
          type: 'select',
        },
      ],
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
  },
};
export default Fields;
