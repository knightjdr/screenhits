const getImage = require('./get-image');
const ObjectId = require('mongodb').ObjectId;
const permission = require('../permission/permission');
const query = require('../query/query');

const RouteHandler = {
  get: (fileID, user) => {
    return new Promise((resolve) => {
      const checkAccess = (imageInfo) => {
        return new Promise((resolveAccess, rejectAccess) => {
          if (
            !imageInfo ||
            !imageInfo.metadata ||
            !imageInfo.metadata.project
          ) {
            rejectAccess('Image cannot be found');
          }
          permission.canView.project([imageInfo.metadata.project], user)
            .then(() => {
              resolveAccess();
            })
            .catch(() => {
              rejectAccess('User does not have permission to access this image');
            })
          ;
        });
      };
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            checkAccess(imageInfo),
            getImage.uri(fileID),
          ]);
        })
        .then((values) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: values[1],
              message: 'Image retrieved',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving the image: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = RouteHandler;
