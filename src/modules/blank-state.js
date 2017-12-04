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
      comment: '',
      condition: '',
      name: '',
      other: {},
      species: '',
      type: '',
    },
    errors: {
      cell: null,
      name: null,
      other: {},
      species: null,
      type: null,
    },
    warning: false,
  },
};
export default BlankState;
