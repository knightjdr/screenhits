// convert an image buffer to PNG

const Jimp = require('jimp');
const sharp = require('sharp');

const Convert = (image, type) => {
  return new Promise((resolve, reject) => {
    if (type.mime === 'image/png') {
      resolve(image);
    } else if (
      type.mime === 'image/bmp' ||
      type.mime === 'image/jpeg'
    ) {
      Jimp.read(image)
        .then((imageToConvert) => {
          return imageToConvert.getBuffer('image/png');
        })
        .then((convertedImage) => {
          resolve(convertedImage);
        })
        .catch((error) => {
          reject(`There was an error with Jimp converting the image: ${error}`);
        })
      ;
    } else if (type.mime === 'image/tif') {
      sharp(image)
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
};
module.exports = Convert;
