const Jimp = require('jimp');

const Channels = {
  getBuffer: (image, channels) => { // takes and returns a buffer
    return new Promise((resolve, reject) => {
      const blue = channels.includes('blue');
      const green = channels.includes('green');
      const red = channels.includes('red');
      Jimp.read(image)
        .then((imageToSplit) => {
          const splitImage = imageToSplit;
          imageToSplit.scan(
            0,
            0,
            imageToSplit.bitmap.width,
            imageToSplit.bitmap.height,
            (x, y, idx) => {
              if (!red) {
                splitImage.bitmap.data[idx + 0] = 0;
              }
              if (!green) {
                splitImage.bitmap.data[idx + 1] = 0;
              }
              if (!blue) {
                splitImage.bitmap.data[idx + 2] = 0;
              }
            }
          );
          splitImage.getBuffer('image/png', (bufferErr, buffer) => {
            resolve(buffer);
          });
        })
        .catch((error) => {
          reject(`There was an error with Jimp splitting the image: ${error}`);
        })
      ;
    });
  },
  getURI: (image, channels) => { // takes and returns a buffer
    return new Promise((resolve, reject) => {
      const blue = channels.includes('blue');
      const green = channels.includes('green');
      const red = channels.includes('red');
      Jimp.read(image)
        .then((imageToSplit) => {
          const splitImage = imageToSplit;
          imageToSplit.scan(
            0,
            0,
            imageToSplit.bitmap.width,
            imageToSplit.bitmap.height,
            (x, y, idx) => {
              if (!red) {
                splitImage.bitmap.data[idx + 0] = 0;
              }
              if (!green) {
                splitImage.bitmap.data[idx + 1] = 0;
              }
              if (!blue) {
                splitImage.bitmap.data[idx + 2] = 0;
              }
            }
          );
          splitImage.getBuffer('image/png', (bufferErr, buffer) => {
            const imageURI = `data:image/png;base64,${buffer.toString('base64')}`;
            resolve(imageURI);
          });
        })
        .catch((error) => {
          reject(`There was an error with Jimp splitting the image: ${error}`);
        })
      ;
    });
  },
  splitAll: (image) => { // takes image buffer
    return new Promise((resolve, reject) => {
      Promise.all([
        Channels.get(image, ['red']),
        Channels.get(image, ['green']),
        Channels.get(image, ['blue']),
      ])
        .then((splitImages) => {
          resolve({
            red: splitImages[0],
            green: splitImages[1],
            blue: splitImages[2],
          });
        })
        .catch((error) => {
          reject(`There was an error splitting the image: ${error}`);
        })
      ;
    });
  },
};
module.exports = Channels;
