// calculates median

const Median = (arr) => {
  const toSort = Object.assign([], arr);
  const sortedArr = toSort.sort((a, b) => { return a - b; });
  const i = sortedArr.length / 2;
  return i % 1 === 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
};
module.exports = Median;
