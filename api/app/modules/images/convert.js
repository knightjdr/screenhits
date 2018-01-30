// convert an image buffer to PNG

const Jimp = require('jimp');
const sharp = require('sharp');

const Convert = {
  bufferToUri: (image) => {
    if (Buffer.isBuffer(image)) {
      const imageURI = `data:image/png;base64,${image.toString('base64')}`;
      return imageURI;
    }
    return null;
  },
  toPNG: (image) => {
    return new Promise((resolve, reject) => {
      if (image.mimetype === 'image/png') {
        resolve(image.data);
      } else if (
        image.mimetype === 'image/bmp' ||
        image.mimetype === 'image/jpeg'
      ) {
        Jimp.read(image.data)
          .then((imageToConvert) => {
            imageToConvert.getBuffer('image/png', (err, convertedImage) => {
              resolve(convertedImage);
            });
          })
          .catch((error) => {
            reject(`There was an error with Jimp converting the image: ${error}`);
          })
        ;
      } else if (image.mimetype === 'image/tiff') {
        sharp(image.data)
          .png()
          .toBuffer()
          .then((convertedImage) => {
            resolve(convertedImage);
          })
          .catch((error) => {
            reject(`There was an error with Sharp converting the image: ${error}`);
          })
        ;
      } else {
        reject('Invalid image type');
      }
    });
  },
  uriToBuffer: (image) => {
    return new Promise((resolve, reject) => {
      if (typeof image === 'object') {
        const bufferObj = {};
        Object.entries(image).forEach(([key, value]) => {
          if (value) { // ignore null values in object
            const re = /^data:image\/png;base64,(.*)$/;
            const matches = value.match(re);
            const data = matches[1];
            bufferObj[key] = new Buffer(data, 'base64');
          }
        });
        resolve(bufferObj);
      } else if (typeof image === 'string') {
        const re = /^data:image\/png;base64,(.*)$/;
        const matches = image.match(re);
        const data = matches[1];
        resolve(new Buffer(data, 'base64'));
      } else {
        reject();
      }
    });
  },
};
module.exports = Convert;
