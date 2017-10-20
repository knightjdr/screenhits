const deleteQuery = require('../crud/delete');
const query = require('../query/query');
const sampleCollections = require('../sample/sample-collections');
const update = require('../crud/update');

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
            Delete.sample({ 'group.experiment': _id }),
            deleteQuery.item('experiment', { _id }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'project':
          Promise.all([
            Delete.sample({ 'group.project': _id }),
            deleteQuery.item('project', { _id }),
            deleteQuery.item('screen', { 'group.project': _id }),
            deleteQuery.item('experiment', { 'group.project': _id }),
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
            Delete.sample({ _id }),
          ])
            .then(resolve())
            .catch((error) => { reject(error); })
          ;
          break;
        case 'screen':
          Promise.all([
            Delete.sample({ 'group.screen': _id }),
            deleteQuery.item('screen', { _id }),
            deleteQuery.item('experiment', { 'group.screen': _id }),
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
  sample: (filter) => {
    return new Promise((resolve, reject) => {
      const getCollections = (samples) => {
        let currSampleTypes = samples.map((sample) => {
          return sample.type;
        });
        currSampleTypes = [...new Set(currSampleTypes)];
        let collections = [];
        currSampleTypes.forEach((type) => {
          collections = collections.concat(sampleCollections[type]);
        });
        return collections;
      };
      query.get('sample', filter, { _id: 1, type: 1 })
        .then((samples) => {
          const collections = getCollections(samples);
          const sampleIds = samples.map((sample) => { return sample._id; });
          return Promise.all(
            collections.map((collection) => {
              return update.subField(
                collection,
                {},
                { $pull: { records: { sample: { $in: sampleIds } } } },
                { multi: true }
              );
            }).concat([
              deleteQuery.item('sample', { _id: { $in: sampleIds } }),
            ])
          );
        })
        .then(resolve())
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = Delete;
