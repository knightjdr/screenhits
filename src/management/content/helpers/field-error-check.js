const ErrorCheck = {
  notEmpty: function(obj) {
    let empty = true;
    for(let key in obj) {
      if(obj[key]) {
        empty = false;
      }
    }
    return empty;
  }
}
export default ErrorCheck;
