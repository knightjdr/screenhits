const Adjustments = require('./adjustments');
const Channels = require('./split-channels');
const Crop = require('./crop-image');
const DeleteImages = require('./delete');
const getImage = require('./get-image');
const Greyscale = require('./greyscale');
const imageConvert = require('./convert');
const ObjectId = require('mongodb').ObjectId;
const permission = require('../permission/permission');
const query = require('../query/query');
const store = require('./store-image');
const Zip = require('./zip-image');

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
  crop: (fileID, body, user) => {
    return new Promise((resolve) => {
      const _id = new ObjectId(fileID);
      const croppedImages = {
        blue: null,
        green: null,
        merge: null,
        red: null,
      };
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.edit(imageInfo, user),
            getImage.buffer(fileID),
          ]);
        })
        .then((values) => {
          return Channels.splitAllBuffer(values[1]);
        })
        .then((channelBuffers) => {
          return Promise.all([
            body.channels.red ?
              Adjustments.brightContrast(
                channelBuffers.red,
                'red',
                body.brightness.red,
                body.contrast.red
              )
              :
              Promise.resolve(),
            body.channels.green ?
              Adjustments.brightContrast(
                channelBuffers.green,
                'green',
                body.brightness.green,
                body.contrast.green
              )
              :
              Promise.resolve(),
            body.channels.blue ?
              Adjustments.brightContrast(
                channelBuffers.blue,
                'blue',
                body.brightness.blue,
                body.contrast.blue
              )
              :
              Promise.resolve(),
          ]);
        })
        .then((adjusted) => {
          return Crop.all(adjusted, body.crop);
        })
        .then((cropped) => {
          croppedImages.blue = imageConvert.bufferToUri(cropped[2]);
          croppedImages.green = imageConvert.bufferToUri(cropped[1]);
          croppedImages.red = imageConvert.bufferToUri(cropped[0]);
          const toMerge = [
            body.toMerge.red ? cropped[0] : null,
            body.toMerge.green ? cropped[1] : null,
            body.toMerge.blue ? cropped[2] : null,
          ];
          return body.channels.merge ? Channels.merge(toMerge) : Promise.resolve();
        })
        .then((merge) => {
          croppedImages.merge = imageConvert.bufferToUri(merge);
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: croppedImages,
              message: 'Crop completed',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error cropping the image: ${error}`,
            },
          });
        })
      ;
    });
  },
  export: (body, user) => {
    return new Promise((resolve) => {
      const _id = new ObjectId(body.fileID);
      const images = {
        blue: null,
        green: null,
        merge: null,
        original: null,
        red: null,
      };
      query.get('imagefs.files', { _id }, { metadata: 1 }, 'findOne')
        .then((imageInfo) => {
          return Promise.all([
            RouteHandler.checkAccess.edit(imageInfo, user),
            getImage.buffer(body.fileID),
          ]);
        })
        .then((values) => {
          images.original = body.toExport.original ? values[1] : null;
          return Channels.splitAllBuffer(values[1]);
        })
        .then((channelBuffers) => {
          return Promise.all([
            body.channels.red && body.toExport.red ?
              Adjustments.brightContrast(
                channelBuffers.red,
                'red',
                body.brightness.red,
                body.contrast.red
              )
              :
              Promise.resolve(),
            body.channels.green && body.toExport.green ?
              Adjustments.brightContrast(
                channelBuffers.green,
                'green',
                body.brightness.green,
                body.contrast.green
              )
              :
              Promise.resolve(),
            body.channels.blue && body.toExport.blue ?
              Adjustments.brightContrast(
                channelBuffers.blue,
                'blue',
                body.brightness.blue,
                body.contrast.blue
              )
              :
              Promise.resolve(),
          ]);
        })
        .then((adjusted) => {
          return Crop.all(adjusted, body.crop);
        })
        .then((cropped) => {
          images.blue = cropped[2];
          images.green = cropped[1];
          images.red = cropped[0];
          const toMerge = [
            body.toMerge.red ? cropped[0] : null,
            body.toMerge.green ? cropped[1] : null,
            body.toMerge.blue ? cropped[2] : null,
          ];
          return body.channels.merge && body.toExport.merge ?
            Channels.merge(toMerge)
            :
            Promise.resolve()
          ;
        })
        .then((merge) => {
          images.merge = merge;
          return Greyscale.convert(images, body.greyscale);
        })
        .then((greyscale) => {
          return Zip.images(greyscale, body.filename);
        })
        .then((zipped) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Crop completed',
              uri: zipped,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error cropping the image: ${error}`,
            },
          });
        })
      ;
    });
  },
  get: (fileID, user) => {
    return new Promise((resolve) => {
      const getChannelMetadata = (channelImages) => {
        const metadata = {
          brightness: {},
          contrast: {},
          crop: {},
          mergeOptions: null,
        };
        channelImages.forEach((image) => {
          metadata.brightness[image.metadata.channel] = image.metadata.brightness;
          metadata.contrast[image.metadata.channel] = image.metadata.contrast;
          metadata.crop[image.metadata.channel] = image.metadata.crop;
          if (image.metadata.channel === 'merge') {
            metadata.mergeOptions = image.metadata.mergeOptions;
          }
        });
        return metadata;
      };
      const getImageArr = (channelItems, _id) => {
        const imageIDs = [
          {
            _id,
            channel: 'original',
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
  getChannel: (fileID, channel, body, user) => {
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
          return Channels.getBuffer(values[1], [channel]);
        })
        .then((channelImage) => {
          return Crop.image(channelImage, body.crop);
        })
        .then((cropped) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: imageConvert.bufferToUri(cropped),
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
        .then((adjusted) => {
          return Crop.all(adjusted, options.crop);
        })
        .then((cropped) => {
          return Channels.merge(cropped);
        })
        .then((merge) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: imageConvert.bufferToUri(merge),
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
      const setMetadata = (channels, parentID, brightness, contrast, crop) => {
        const metadata = {};
        channels.forEach((channel) => {
          metadata[channel] = {
            brightness: brightness[channel],
            channel,
            contrast: contrast[channel],
            crop,
            parentID,
          };
          if (channel === 'merge') {
            metadata[channel].mergeOptions = body.mergeOptions || {};
          }
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
            setMetadata(storeChannels, _id, body.brightness, body.contrast, body.crop)
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
  splitImage: (fileID, body, user) => {
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
        .then((splitImages) => {
          return Crop.all([splitImages.red, splitImages.green, splitImages.blue], body.crop);
        })
        .then((cropped) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: {
                blue: imageConvert.bufferToUri(cropped[2]),
                green: imageConvert.bufferToUri(cropped[1]),
                red: imageConvert.bufferToUri(cropped[0]),
              },
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
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              image: imageConvert.bufferToUri(buffer),
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
