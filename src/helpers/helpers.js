// custom sort functions
const customSort = {
  // sort an array of objects by a particular key's values in direction 'asc' or 'desc'
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

// for an array or objects, return an array of indexes where object[key] === value
const findIndexes = (arr, key, value) => {
  const indexes = [];
  arr.forEach((obj, index) => {
    if (obj[key] === value) {
      indexes.push(index);
    }
  });
  return indexes;
};

// for a simple array-like object (string indexes), return an array of indexes with value
const findObjectIndexes = (obj, value) => {
  const indexes = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key] === value) {
      indexes.push(key);
    }
  });
  return indexes;
};

// check if object has no values assigned to its keys, including nested objects
const objectEmpty = (obj) => {
  let empty = true;
  Object.values(obj).forEach((v) => {
    if (v && typeof v !== 'object') {
      empty = false;
    } else if (v && typeof v === 'object') {
      empty = objectEmpty(v);
    }
  });
  return empty;
};

// Capitalize the first letter of a string
const uppercaseFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

export { customSort, findIndexes, findObjectIndexes, objectEmpty, uppercaseFirst };
