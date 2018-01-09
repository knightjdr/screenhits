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
    cellMods: {
      help: 'Enter any cell line modifications as a comma-separated list.',
    },
    condition: {
      help: `Specificy any other conditions/cell treatments relevant to the screen
        that were not specified under cell modifications or drug treatments.`,
    },
    drugs: {
      help: `Enter all drugs used in the screen as a comma-separated list of
      PubChem compound IDs`,
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
            'TKO v1',
            'TKO v2',
            'TKO v3',
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
    type: {
      values: [
        'CRISPR',
      ],
    },
  },
};
export default Fields;
