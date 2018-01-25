const Jimp = require('jimp');

const Adjustments = {
  brightContrast: (image, brightness, contrast) => {
    return new Promise((resolve, reject) => {
      Jimp.read(image)
        .then((jimpImage) => {
          jimpImage
            .brightness(brightness)
            .contrast(contrast)
            .getBuffer('image/png', (bufferErr, buffer) => {
              resolve(buffer);
            })
          ;
        })
        .catch((error) => {
          reject(`There was an error with Jimp updating the image: ${error}`);
        })
      ;
    });
  },
};
module.exports = Adjustments;
