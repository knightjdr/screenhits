const Validate = {
  project: {
    checkFields: [
      'description',
      'name',
      'permission'
    ],
    description: (value) => {
      let errorObj = {
        error: false,
        message: null
      };
      if(!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    name: (value) => {
      let errorObj = {
        error: false,
        message: null
      };
      if(!value) {
        errorObj.error = true;
        errorObj.message = 'This field is required';
      }
      return errorObj;
    },
    permission: (value) => {
      let errorObj = {
        error: false,
        message: null
      };
      const valid = ['lr', 'lw', 'ar', 'aw', 'n'];
      if(!value || valid.indexOf(value) < 0) {
        errorObj.error = true;
        errorObj.message = 'Invalid permission type';
      }
      return errorObj;
    }
  }
}
export default Validate;
