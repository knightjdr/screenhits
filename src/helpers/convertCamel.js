const convert = {
  toLower: (text) => {
    return text.replace(/([A-Z])/g, ' $1').toLowerCase();
  },
  unmod: (text) => {
    return text.replace(/([A-Z])/g, ' $1');
  },
};
export default convert;
