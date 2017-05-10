const objectEmpty = (obj) => {
  let empty = true;
  Object.values(obj).forEach((v) => {
    if (v) {
      empty = false;
    }
  });
  return empty;
};

const customSort = {
  arrayOfObjectByKey: (arr, key, direction) => {
    if (!key) {
      return arr;
    }
    const returnValue = direction === 'asc' ? -1 : 1;
    arr.sort((a, b) => {
      const nameA = a[key].toUpperCase();
      const nameB = b[key].toUpperCase();
      if (nameA < nameB) {
        return returnValue;
      }
      if (nameA > nameB) {
        return -returnValue;
      }
      return 0;
    });
    return arr;
  },
};

const uppercaseFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

export { objectEmpty, customSort, uppercaseFirst };
