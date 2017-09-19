const Validate = {
  userArray: (arr) => {
    return new Promise((resolve, reject) => {
      arr.forEach((obj) => {
        if (
          !obj.email ||
          !obj.lab ||
          !obj.name ||
          !obj.permission
        ) {
          reject('User array error');
        }
      });
      resolve();
    });
  },
};
module.exports = Validate;
