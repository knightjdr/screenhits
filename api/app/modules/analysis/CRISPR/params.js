const Convert = require('./convert-input.js');

const Params = {
  get: (analysis, defaults) => {
    const params = {};
    // want to ensure input field and default are both of the same type:
    // text or numeric, if not then use the default
    Object.keys(defaults).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(analysis, key) &&
        analysis[key] &&
        (
          (isNaN(analysis[key]) && isNaN(defaults[key])) ||
          (!isNaN(analysis[key]) && !isNaN(defaults[key]))
        ) ?
          Convert.UnknownInputType(analysis[key])
          :
          defaults[key]
      ;
      params[key] = value;
    });
    return params;
  },
};
module.exports = Params;
