import deepEqual from 'deep-equal';

// custom sort functions
const customSort = {
  // sort an array of objects by a particular key's values in direction 'asc' or 'desc'
  arrayOfObjectByKey: (arr, key, direction) => {
    const sortArray = JSON.parse(JSON.stringify(arr));
    if (!key) {
      return sortArray;
    }
    const returnValue = direction === 'asc' ? -1 : 1;
    sortArray.sort((a, b) => {
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
    return sortArray;
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

// check if two objects are equal, ignoring null keys
const isObjectLooseEqual = (obj1, obj2) => {
  const testObj1 = obj1;
  const testObj2 = obj2;
  Object.keys(testObj1).forEach((key) => {
    if (!testObj1[key]) {
      delete testObj1[key];
    }
  });
  Object.keys(testObj2).forEach((key) => {
    if (!testObj2[key]) {
      delete testObj2[key];
    }
  });
  return deepEqual(testObj1, testObj2);
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

export {
  customSort,
  findIndexes,
  findObjectIndexes,
  isObjectLooseEqual,
  objectEmpty,
  uppercaseFirst,
};
