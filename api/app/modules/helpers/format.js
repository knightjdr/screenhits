const Format = {
  uppercaseFirst: (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1);
  },
};
module.exports = Format;
