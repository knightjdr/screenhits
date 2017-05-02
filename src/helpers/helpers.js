const objectEmpty = (obj) => {
  let empty = true;
  Object.values(obj).forEach((v) => {
    if (v) {
      empty = false;
    }
  });
  return empty;
};

const uppercaseFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

export { objectEmpty, uppercaseFirst };
