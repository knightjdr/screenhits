// removes duplicates from an array

const ArrayUnique = (arr) => {
  return [...new Set(arr)];
};
module.exports = ArrayUnique;
