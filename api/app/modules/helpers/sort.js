const Sort = {
  arrayOfObjectByKey: (arr, key) => {
    arr.sort((a, b) => {
      const nameA = a[key].toUpperCase();
      const nameB = b[key].toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return arr;
  },
};
module.exports = Sort;
