const Validate = {
  project: {
    checkFields: [
      'description',
      'name',
      'permission',
    ],
    description: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    name: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    permission: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      const valid = ['lr', 'lw', 'ar', 'aw', 'n'];
      if (!value || valid.indexOf(value) < 0) {
        errorObj.error = true;
        errorObj.message = 'Invalid permission type';
      }
      return errorObj;
    },
  },
  screen: {
    checkFields: [
      'cell',
      'condition',
      'description',
      'name',
      'species',
      'type',
    ],
    cell: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'Select a cell type from the dropdown, or specify one via free text';
      }
      return errorObj;
    },
    condition: () => {
      const errorObj = {
        error: false,
        message: null,
      };
      return errorObj;
    },
    description: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    name: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    species: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'Select a species from the dropdown, or specify one via free text';
      }
      return errorObj;
    },
    type: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      const valid = ['CRISPR', 'Generic', 'Microscopy'];
      if (!value || valid.indexOf(value) < 0) {
        errorObj.error = true;
        errorObj.message = 'Screen type must be selected';
      }
      return errorObj;
    },
  },
  experiment: {
    checkFields: [
      'description',
      'name',
    ],
    description: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    name: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
  },
};
export default Validate;
