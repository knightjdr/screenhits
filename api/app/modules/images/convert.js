// convert an image buffer to PNG

const Jimp = require('jimp');
const sharp = require('sharp');

const Convert = (image) => {
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
};
module.exports = Convert;
