const Jimp = require('jimp');

const Crop = {
  all: (images, cropParams) => {
    return new Promise((resolve, reject) => {
      if (
        cropParams &&
        cropParams.height > 0 &&
        cropParams.width > 0
      ) {
        Promise.all([
          images[0] ? Crop.image(images[0], cropParams) : Promise.resolve(),
          images[1] ? Crop.image(images[1], cropParams) : Promise.resolve(),
          images[2] ? Crop.image(images[2], cropParams) : Promise.resolve(),
        ])
          .then((cropped) => {
            resolve(cropped);
          })
          .catch((error) => {
            reject(`There was an error merging the channels: ${error}`);
          })
        ;
      } else {
        resolve(images);
      }
    });
  },
  image: (image, params) => {
    return new Promise((resolve, reject) => {
      if (
        params &&
        params.height > 0 &&
        params.width > 0
      ) {
        Jimp.read(image)
          .then((jimpImage) => {
            const imageDims = {
              height: jimpImage.bitmap.height,
              width: jimpImage.bitmap.width,
            };
            const options = {
              h: Math.round((params.height / params.maxHeight) * imageDims.height),
              w: Math.round((params.width / params.maxWidth) * imageDims.width),
              x: Math.round((params.x / params.maxWidth) * imageDims.width),
              y: Math.round((params.y / params.maxHeight) * imageDims.height),
            };
            jimpImage.crop(options.x, options.y, options.w, options.h);
            jimpImage.getBuffer('image/png', (bufferErr, buffer) => {
              resolve(buffer);
            });
          })
          .catch((error) => {
            reject(`There was an error with Jimp cropping the image: ${error}`);
          })
        ;
      } else {
        resolve(image);
      }
    });
  },
};
module.exports = Crop;
