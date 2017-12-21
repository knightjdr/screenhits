// rounds a number to the specified precision

const Round = (num, desiredPrecision = 1) => {
  let precision = desiredPrecision;
  if (!Number.isInteger(precision)) {
    precision = Math.floor(precision);
  }
  if (precision < 1) {
    precision = 1;
  }
  const scaling = 10 ** precision;
  return Math.round(num * (scaling + Number.EPSILON)) / scaling;
};
module.exports = Round;
