const objectEmpty = (obj) => {
  let empty = true;
  Object.values(obj).for((v) => {
    if (v) {
      empty = false;
    }
  });
  return empty;
};

const uppercaseFirst = string => string.charAt(0).toUpperCase() + string.substring(1);

export { objectEmpty, uppercaseFirst };
