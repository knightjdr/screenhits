// gets an image buffer from the imagefs collection based on an object ID

const databases = require('../../connections/database');
const ObjectId = require('mongodb').ObjectId;

const getImage = {
  buffer: (_id) => {
    return new Promise((resolve, reject) => {
      const chunkBuffer = [];
      const imageObject = {
        _id: new ObjectId(_id),
        root: 'imagefs',
      };
      const readstream = databases.grid().createReadStream(imageObject);
      readstream.on('data', (chunk) => {
        chunkBuffer.push(chunk);
      });
      readstream.on('end', () => {
        const imageBuffer = Buffer.concat(chunkBuffer);
        resolve(imageBuffer);
      });
      readstream.on('error', (readError) => {
        reject(`There was an error retrieving the image: ${readError}`);
      });
    });
  },
  uri: (_id) => {
    return new Promise((resolve, reject) => {
      const chunkBuffer = [];
      const imageObject = {
        _id: new ObjectId(_id),
        root: 'imagefs',
      };
      const readstream = databases.grid().createReadStream(imageObject);
      readstream.on('data', (chunk) => {
        chunkBuffer.push(chunk);
      });
      readstream.on('end', () => {
        const imageBuffer = Buffer.concat(chunkBuffer);
        const imageURI = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        resolve(imageURI);
      });
      readstream.on('error', (readError) => {
        reject(`There was an error retrieving the image: ${readError}`);
      });
    });
  },
};
module.exports = getImage;
