// calculates median

const Mean = (arr) => {
  const sum = arr.reduce((a, b) => { return a + b; });
  return sum / arr.length;
};
module.exports = Mean;
