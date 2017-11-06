const convert = {
  unmod: (text) => {
    return text.replace(/([A-Z])/g, ' $1');
  },
  toLower: (text) => {
    return text.replace(/([A-Z])/g, ' $1').toLowerCase();
  },
};
export default convert;
