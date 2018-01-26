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
  checkAccess: {
    edit: (imageInfo, user) => {
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
    },
    view: (imageInfo, user) => {
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
    },
  },
  get: (fileID, user) => {
    return new Promise((resolve) => {
      const getChannelMetadata = (channelImages) => {
        const metadata = {
          brightness: {},
          contrast: {},
        };
        channelImages.forEach((image) => {
          metadata.brightness[image.metadata.channel] = image.metadata.brightness;
          metadata.contrast[image.metadata.channel] = image.metadata.contrast;
        });
        return metadata;
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
      let metadata;
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          // confirm project access and see if channel images exist
          return Promise.all([
            RouteHandler.checkAccess.view(imageInfo, user),
            query.get('imagefs.files', { 'metadata.parentID': _id }, { _id: 1, metadata: 1 }),
          ]);
        })
        .then((values) => {
          const channelImages = values[1];
          metadata = getChannelMetadata(channelImages);
          // get channel images
          const imageIDs = getImageArr(channelImages, _id);
          return getImage.uriArr(imageIDs);
        })
        .then((images) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: images,
              metadata,
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
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.view(imageInfo, user),
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
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.view(imageInfo, user),
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.splitAllBuffer(values[1]);
        })
        .then((channelBuffers) => {
          return Promise.all([
            options.toMerge.red ?
              Adjustments.brightContrast(
                channelBuffers.red,
                'red',
                options.brightness.red,
                options.contrast.red
              )
              :
              Promise.resolve(),
            options.toMerge.green ?
              Adjustments.brightContrast(
                channelBuffers.green,
                'green',
                options.brightness.green,
                options.contrast.green
              )
              :
              Promise.resolve(),
            options.toMerge.blue ?
              Adjustments.brightContrast(
                channelBuffers.blue,
                'blue',
                options.brightness.blue,
                options.contrast.blue
              )
              :
              Promise.resolve(),
          ]);
        })
        .then((images) => {
          return Channels.merge(images);
        })
        .then((buffer) => {
          return imageConvert.bufferToUri(buffer);
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
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.edit(imageInfo, user),
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
      const setMetadata = (channels, parentID, brightness, contrast) => {
        const metadata = {};
        channels.forEach((channel) => {
          metadata[channel] = {
            brightness: brightness[channel],
            channel,
            contrast: contrast[channel],
            parentID,
          };
        });
        return metadata;
      };
      const _id = new ObjectId(fileID);
      let convertedImages;
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return RouteHandler.checkAccess.edit(imageInfo, user);
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
          return store.images(
            convertedImages,
            setMetadata(storeChannels, _id, body.brightness, body.contrast)
          );
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
      const _id = new ObjectId(fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.view(imageInfo, user),
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.splitAllUri(values[1]);
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
      const _id = new ObjectId(body.fileID);
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.view(imageInfo, user),
            getImage.buffer(body.fileID),
          ]);
        })
        .then((values) => {
          const image = values[1];
          return Channels.getBuffer(image, [body.channel]);
        })
        .then((buffer) => {
          return Adjustments.brightContrast(buffer, body.channel, body.brightness, body.contrast);
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
