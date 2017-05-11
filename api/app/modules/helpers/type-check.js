const TypeCheck = {
  string: (value) => {
    return new Promise((resolve, reject) => {
      const confirm = typeof value === 'string';
      if (confirm) {
        resolve();
      } else {
        reject('The search value is an invalid type');
      }
    });
  },
};
module.exports = TypeCheck;
