const Jimp = require('jimp');

const Channels = {
  getChannel: (image, red, green, blue) => { // takes and returns a buffer
    return new Promise((resolve, reject) => {
      Jimp.read(image)
        .then((imageToSplit) => {
          imageToSplit
            .scan(0, 0, imageToSplit.bitmap.width, imageToSplit.bitmap.height, (x, y, idx) => {
              if (!red) {
                this.bitmap.data[idx + 0] = 0;
              }
              if (!green) {
                this.bitmap.data[idx + 1] = 0;
              }
              if (!blue) {
                this.bitmap.data[idx + 2] = 0;
              }
            })
            .getBuffer('image/png', (bufferErr, buffer) => {
              resolve(buffer);
            })
          ;
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
        Channels.getChannel(image, true, false, false),
        Channels.getChannel(image, false, true, false),
        Channels.getChannel(image, false, false, true),
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
