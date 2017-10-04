const BlankState = {
  experiment: {
    formData: {
      comment: '',
      concentration: '',
      description: '',
      name: '',
      protocols: [],
      timepoint: '',
    },
    errors: {
      description: null,
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
      name: '',
      replicate: '',
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
      description: '',
      name: '',
      other: {},
      species: '',
      type: '',
    },
    errors: {
      cell: null,
      description: null,
      name: null,
      other: {},
      species: null,
      type: null,
    },
    warning: false,
  },
};
export default BlankState;
