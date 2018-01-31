const deleteQuery = require('../crud/delete');
const Permission = require('../permission/permission');
const query = require('../query/query');
const sampleCollections = require('../sample/sample-collections');
const update = require('../crud/update');

const Delete = {
  item: (target, _id, user) => {
    return new Promise((resolve) => {
      Permission.canEdit[target](_id, user)
        .then(() => {
          return Delete.getDeletionPromises(target, _id);
        })
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
        case 'template':
          Promise.all([
            deleteQuery.item('template', { _id }),
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
      // get screen specific collections to remove from
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
      // get sample information
      query.get('sample', filter, { _id: 1, type: 1, files_id: 1 })
        .then((samples) => {
          // get specific collections to query and delete from for this screen type
          const collections = getCollections(samples);
          // get any associated image file IDs
          const fileIDs = samples
            .filter((sample) => { return sample.files_id; })
            .map((filterSample) => { return filterSample.files_id; })
          ;
          const sampleIds = samples.map((sample) => { return sample._id; });
          return Promise.all(
            [
              query.get('imagefs.files', { 'metadata.parentID': { $in: fileIDs } }, { _id: 1 }), // see if the image has been split
              deleteQuery.item('sample', { _id: { $in: sampleIds } }), // delete sample
              deleteQuery.item('imagefs.files', { _id: { $in: fileIDs } }), // delete input images
              deleteQuery.item('imagefs.chunks', { files_id: { $in: fileIDs } }), // delete input chunks
            ].concat(collections.map((collection) => {
              return update.subField(
                collection,
                {},
                { $pull: { records: { sample: { $in: sampleIds } } } },
                { multi: true }
              );
            }))
          );
        })
        .then((values) => {
          // if there are any images that were split from the main file, delete them
          const splitImages = values[0].map((splitImage) => { return splitImage._id; });
          return splitImages.length > 0 ?
            Promise.all([
              deleteQuery.item('imagefs.files', { _id: { $in: splitImages } }), // delete split images
              deleteQuery.item('imagefs.chunks', { files_id: { $in: splitImages } }), // delete split chunks
            ])
            :
            Promise.resolve()
          ;
        })
        .then(resolve())
        .catch((error) => {
          console.log(error);
          reject(error);
        })
      ;
    });
  },
};
module.exports = Delete;
