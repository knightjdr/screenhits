const deleteQuery = require('../crud/delete');

const Delete = {
  item: (target, _id) => {
    return new Promise((resolve) => {
      Delete.getDeletionPromises(target, _id)
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: `Deletion of ${target} ${_id} successful`,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error deleting this ${target}: ${error}`,
            },
          });
        })
      ;
    });
  },
  getDeletionPromises: (target, _id) => {
    return new Promise((resolve, reject) => {
      switch (target) {
        case 'experiment':
          Promise.all([
            deleteQuery.item('experiment', { _id }),
            deleteQuery.item('sample', { group: { experiment: _id } }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'project':
          Promise.all([
            deleteQuery.item('project', { _id }),
            deleteQuery.item('screen', { group: { project: _id } }),
            deleteQuery.item('experiment', { group: { project: _id } }),
            deleteQuery.item('sample', { group: { project: _id } }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'protocol':
          Promise.all([
            deleteQuery.item('protocol', { _id }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'sample':
          Promise.all([
            deleteQuery.item('sample', { _id }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'screen':
          Promise.all([
            deleteQuery.item('screen', { _id }),
            deleteQuery.item('experiment', { group: { screen: _id } }),
            deleteQuery.item('sample', { group: { screen: _id } }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        default:
          reject('Invalid target for deletion');
          break;
      }
    });
  },
};
module.exports = Delete;
