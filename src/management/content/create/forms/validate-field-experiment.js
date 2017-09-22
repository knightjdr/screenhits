const Validate = {
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
};
export default Validate;
