const deleteOperation = require('../crud/delete');

const Delete = {
  arr: (arr) => {
    return new Promise((resolve, reject) => {
      const next = (index) => {
        if (index < arr.length) {
          Promise.all([
            deleteOperation.item('imagefs.files', { _id: arr[index] }),
            deleteOperation.item('imagefs.chunks', { files_id: arr[index] }),
          ])
            .then(() => {
              next(index + 1);
            })
            .catch((error) => {
              reject(`There was an error deleting the images: ${error}`);
            })
          ;
        } else {
          resolve();
        }
      };
      next(0);
    });
  },
  item: () => {},
};
module.exports = Delete;
