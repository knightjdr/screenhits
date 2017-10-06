const Fields = {
  experiment: {
    concentration: {
      help: 'Specificy the drug or treatment concentration used in the experiment, if any.',
    },
    protocols: {
      help: `Select all protocols associated with this experiment. Use the menu action bottom
      in the bottom left to create a new protocol if needed. Only your protocols will be
      visible here.`,
    },
    timepoint: {
      help: 'Specificy the time point of the experiment, if any.',
    },
  },
  project: {
  },
  sample: {
    concentration: {
      help: `Specificy the drug or treatment concentration used on the sample if
      the experiment was performed at a fixed timepoint.`,
    },
    replicate: {
      help: `Use this field to indicate the replicate number and type (biological
      or technical)`,
    },
    timepoint: {
      help: `Specificy the time point of the sample if the experiment was performed
      with a fixed drug concentration.`,
    },
  },
  screen: {
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
  },
};
export default Fields;
