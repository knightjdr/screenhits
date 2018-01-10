const BlankState = {
  experiment: {
    formData: {
      comment: '',
      concentration: '',
      name: '',
      protocols: [],
      timepoint: '',
    },
    errors: {
      name: null,
    },
    warning: false,
  },
  project: {
    formData: {
      comment: '',
      description: '',
      name: '',
      permission: 'lr',
    },
    errors: {
      description: null,
      name: null,
      permission: null,
    },
    warning: false,
  },
  sample: {
    formData: {
      comment: '',
      concentration: '',
      fileType: '',
      name: '',
      replicate: '',
      timepoint: '',
    },
    errors: {
      name: null,
    },
    warning: false,
  },
  screen: {
    formData: {
      cell: '',
      cellID: '',
      cellMods: '',
      comment: '',
      condition: '',
      drugs: '',
      name: '',
      other: {},
      species: '',
      taxonID: null,
      type: '',
    },
    errors: {
      cell: null,
      name: null,
      other: {},
      taxonID: null,
      type: null,
    },
    warning: false,
  },
};
export default BlankState;
