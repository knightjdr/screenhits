const Adjustments = require('./adjustments');
const Channels = require('./split-channels');
const DeleteImages = require('./delete');
const getImage = require('./get-image');
const imageConvert = require('./convert');
const ObjectId = require('mongodb').ObjectId;
const permission = require('../permission/permission');
const query = require('../query/query');
const store = require('./store-image');

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
      const getImageArr = (channelItems, _id) => {
        const imageIDs = [
          {
            _id,
            channel: 'fullColor',
          },
        ];
        channelItems.forEach((item) => {
          imageIDs.push({
            _id: item._id,
            channel: item.metadata.channel,
          });
        });
        return imageIDs;
      };
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          // confirm project access and see if channel images exist
          return Promise.all([
            checkAccess(imageInfo),
            query.get('imagefs.files', { 'metadata.parentID': _id }, { _id: 1, 'metadata.channel': 1 }),
          ]);
        })
        .then((values) => {
          // get channel images
          const imageIDs = getImageArr(values[1], _id);
          return getImage.uriArr(imageIDs);
        })
        .then((images) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: images,
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
  getChannel: (fileID, channel, user) => {
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
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.getURI(values[1], [channel]);
        })
        .then((image) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image,
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
  getMerge: (fileID, options, user) => {
    return new Promise((resolve) => {
      const channelsArr = (channelsObj) => {
        const channels = [];
        Object.entries(channelsObj).forEach(([channel, show]) => {
          if (show) {
            channels.push(channel);
          }
        });
        return channels;
      };
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
      const channels = channelsArr(options);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            checkAccess(imageInfo),
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.getURI(values[1], channels);
        })
        .then((image) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image,
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
  delete: (fileID, user) => {
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
          permission.canEdit.project([imageInfo.metadata.project], user)
            .then(() => {
              resolveAccess();
            })
            .catch(() => {
              rejectAccess('User does not have permission to edit this image');
            })
          ;
        });
      };
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            checkAccess(imageInfo),
            query.get('imagefs.files', { 'metadata.parentID': _id }, { _id: 1 }),
          ]);
        })
        .then((values) => {
          const toDelete = values[1].map((item) => { return item._id; });
          return DeleteImages.arr(toDelete);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Image(s) deleted',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error deleting the image(s): ${error}`,
            },
          });
        })
      ;
    });
  },
  save: (fileID, body, user) => {
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
          permission.canEdit.project([imageInfo.metadata.project], user)
            .then(() => {
              resolveAccess();
            })
            .catch(() => {
              rejectAccess('User does not have permission to edit this image');
            })
          ;
        });
      };
      const setMetadata = (channels, parentID) => {
        const metadata = {};
        channels.forEach((channel) => {
          metadata[channel] = {
            channel,
            parentID,
          };
        });
        return metadata;
      };
      const _id = new ObjectId(fileID);
      let convertedImages;
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return checkAccess(imageInfo);
        })
        .then(() => {
          return Promise.all([
            imageConvert.uriToBuffer(body.channels),
            query.get('imagefs.files', { 'metadata.parentID': _id }, { _id: 1 }),
          ]);
        })
        .then((values) => {
          convertedImages = values[0];
          const toDelete = values[1].map((item) => { return item._id; });
          return DeleteImages.arr(toDelete);
        })
        .then(() => {
          const storeChannels = Object.keys(convertedImages);
          return store.images(convertedImages, setMetadata(storeChannels, _id));
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Image(s) saved',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error saving the image(s): ${error}`,
            },
          });
        })
      ;
    });
  },
  splitImage: (fileID, user) => {
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
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.splitAll(values[1]);
        })
        .then((images) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: images,
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
  update: (body, user) => {
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
      const _id = new ObjectId(body.fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            checkAccess(imageInfo),
            getImage.buffer(body.fileID),
          ]);
        })
        .then((values) => {
          const image = values[1];
          return Channels.getBuffer(image, [body.channel]);
        })
        .then((buffer) => {
          return Adjustments.brightContrast(buffer, body.brightness, body.contrast);
        })
        .then((buffer) => {
          return imageConvert.bufferToUri(buffer);
        })
        .then((newImage) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: newImage,
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
