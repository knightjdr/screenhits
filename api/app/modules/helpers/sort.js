const Sort = {
  arrayOfObjectByKey: (arr, key) => {
    const sortArray = JSON.parse(JSON.stringify(arr));
    sortArray.sort((a, b) => {
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
    return sortArray;
  },
  arrayOfObjectByKeyNumber: (arr, key, direction = 'asc') => {
    const sortArray = JSON.parse(JSON.stringify(arr));
    sortArray.sort((a, b) => {
      if (direction === 'asc') {
        return a[key] - b[key];
      }
      return b[key] - a[key];
    });
    return sortArray;
  },
};
module.exports = Sort;
