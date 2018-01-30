const Jimp = require('jimp');

const Greyscale = {
  image: (image) => {
    return new Promise((resolve, reject) => {
      Jimp.read(image)
        .then((jimpImage) => {
          jimpImage.greyscale();
          jimpImage.getBuffer('image/png', (bufferErr, buffer) => {
            resolve(buffer);
          });
        })
        .catch((error) => {
          reject(`There was an error with Jimp greying the image: ${error}`);
        })
      ;
    });
  },
  convert: (images, options) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        images.blue && options.blue ?
          Greyscale.image(images.blue)
          :
          Promise.resolve(images.blue || null),
        images.green && options.green ?
          Greyscale.image(images.green)
          :
          Promise.resolve(images.green || null),
        images.merge && options.merge ?
          Greyscale.image(images.merge)
          :
          Promise.resolve(images.merge || null),
        images.original && options.original ?
          Greyscale.image(images.original)
          :
          Promise.resolve(images.original || null),
        images.red && options.red ?
          Greyscale.image(images.red)
          :
          Promise.resolve(images.red || null),
      ])
        .then((greyedImages) => {
          resolve({
            blue: greyedImages[0],
            green: greyedImages[1],
            merge: greyedImages[2],
            original: greyedImages[3],
            red: greyedImages[4],
          });
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = Greyscale;
