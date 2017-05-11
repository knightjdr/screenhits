const Validate = {
  type: (permission) => {
    return new Promise((resolve, reject) => {
      const acceptable = ['lr', 'lw', 'ar', 'aw', 'n'];
      const index = acceptable.indexOf(permission);
      if (index > -1) {
        resolve();
      } else {
        reject('Selected permission is invalid');
      }
    });
  },
};
module.exports = Validate;
