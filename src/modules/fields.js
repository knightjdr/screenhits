const Fields = {
  experiment: {
    concentration: {
      help: `Specificy the drug or treatment concentration used in the experiment, if any.
        This field is optional.`,
    },
    protocols: {
      help: `Select all protocols associated with this experiment. Use the menu action bottom
      in the bottom left to create a new protocol if needed. Only your protocols will be
      visible here.`,
    },
    timepoint: {
      help: 'Specificy the time point of the experiment, if any. This field is optional.',
    },
  },
  project: {
  },
  sample: {
    concentration: {
      help: `Specificy the drug or treatment concentration used on the sample if
      the experiment was performed at a fixed timepoint. This field is optional.`,
    },
    digitalZoom: {
      help: `Specify any digital zooming done via the microscope or post image
        acquisition in Photoshop, etc. This field is optional.`,
    },
    microscope: {
      help: 'Indicate the micoscrope used for acquiring the image. This field is optional.',
    },
    objective: {
      help: 'Indicate the objective used for acquiring the image. This field is optional.',
    },
    replicate: {
      help: `Use this field to indicate the replicate number and type (biological
      or technical)`,
    },
    timepoint: {
      help: `Specificy the time point of the sample if the experiment was performed
      with a fixed drug concentration. This field is optional.`,
    },
  },
  screen: {
    cellID: {
      help: `An identifier for the cell line, for example from ATCC or Cellosaurus.
        This field is optional.`,
    },
    cellMods: {
      help: 'Enter any cell line modifications as a comma-separated list. This field is optional.',
    },
    condition: {
      help: `Specificy any other conditions/cell treatments relevant to the screen
        that were not specified under cell modifications or drug treatments. This field is optional.`,
    },
    drugs: {
      help: `Enter all drugs used in the screen as a comma-separated list of
      PubChem compound IDs. This field is optional.`,
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
        'Microscopy',
      ],
    },
  },
};
export default Fields;
