const ConvertInput = {
  UnknownInputType: (input) => {
    return isNaN(input) ? input : Number(input);
  },
};
module.exports = ConvertInput;
