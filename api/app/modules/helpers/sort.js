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
      const x = Number(a[key]);
      const y = Number(b[key]);
      if (direction === 'asc') {
        return x - y;
      }
      return x - y;
    });
    return sortArray;
  },
};
module.exports = Sort;
