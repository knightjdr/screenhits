const Validate = {
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
  sample: {
    checkFields: [
      'name',
    ],
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
  screen: {
    checkFields: [
      'cell',
      'description',
      'name',
      'species',
      'type',
    ],
    otherCheckFields: [
      'CRISPR_approach',
      'CRISPR_library',
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
    // validators for 'other' fields
    CRISPR_approach: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'Select an approach from the dropdown';
      }
      return errorObj;
    },
    CRISPR_library: (value) => {
      const errorObj = {
        error: false,
        message: null,
      };
      if (!value) {
        errorObj.error = true;
        errorObj.message = 'Select a library from the dropdown';
      }
      return errorObj;
    },
  },
};
export default Validate;
