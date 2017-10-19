const Random = {
  int: (min, max) => {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max + 1);
    return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  },
};
export default Random;
