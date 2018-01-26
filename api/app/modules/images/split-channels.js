const Jimp = require('jimp');
const MergeScan = require('./merge-scan');
const Scan = require('./scan');

const Channels = {
  getBuffer: (image, channels) => { // takes and returns a buffer
    return new Promise((resolve, reject) => {
      let scanFunc = '';
      scanFunc += channels.includes('red') ? 'r' : '';
      scanFunc += channels.includes('green') ? 'g' : '';
      scanFunc += channels.includes('blue') ? 'b' : '';
      Jimp.read(image)
        .then((jimpImage) => {
          const splitJimp = Scan[scanFunc](jimpImage);
          splitJimp.getBuffer('image/png', (bufferErr, buffer) => {
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
      let scanFunc = '';
      scanFunc += channels.includes('red') ? 'r' : '';
      scanFunc += channels.includes('green') ? 'g' : '';
      scanFunc += channels.includes('blue') ? 'b' : '';
      Jimp.read(image)
        .then((jimpImage) => {
          const splitJimp = Scan[scanFunc](jimpImage);
          splitJimp.getBuffer('image/png', (bufferErr, buffer) => {
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
  merge: (images) => {
    return new Promise((resolve, reject) => {
      let scanFunc = '';
      scanFunc += images[0] ? 'r' : '';
      scanFunc += images[1] ? 'g' : '';
      scanFunc += images[2] ? 'b' : '';
      Promise.all([
        Jimp.read(images[0]),
        Jimp.read(images[1]),
        Jimp.read(images[2]),
      ])
        .then((jimpArr) => {
          const mergedJimp = MergeScan[scanFunc](jimpArr);
          mergedJimp.getBuffer('image/png', (bufferErr, buffer) => {
            resolve(buffer);
          });
        })
        .catch((error) => {
          console.log(error);
          reject(`There was an error merging the channels: ${error}`);
        })
      ;
    });
  },
  splitAllBuffer: (image) => { // takes image buffer
    return new Promise((resolve, reject) => {
      Promise.all([
        Channels.getBuffer(image, ['blue']),
        Channels.getBuffer(image, ['green']),
        Channels.getBuffer(image, ['red']),
      ])
        .then((splitImages) => {
          resolve({
            blue: splitImages[0],
            green: splitImages[1],
            red: splitImages[2],
          });
        })
        .catch((error) => {
          reject(`There was an error splitting the image: ${error}`);
        })
      ;
    });
  },
  splitAllUri: (image) => { // takes image buffer
    return new Promise((resolve, reject) => {
      Promise.all([
        Channels.getURI(image, ['blue']),
        Channels.getURI(image, ['green']),
        Channels.getURI(image, ['red']),
      ])
        .then((splitImages) => {
          resolve({
            blue: splitImages[0],
            green: splitImages[1],
            red: splitImages[2],
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
