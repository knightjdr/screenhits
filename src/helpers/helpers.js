const objectEmpty = (obj) => {
  let empty = true;
  for(let key in obj) {
    if(obj[key]) {
      empty = false;
    }
  }
  return empty;
}

const uppercaseFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
}
export { objectEmpty, uppercaseFirst };
