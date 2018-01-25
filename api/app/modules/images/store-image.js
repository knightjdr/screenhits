// takes an image buffer and associated information and writes it to imagefs collection
// metadata should be of the form:
/* metadata = {
  red: {
    antibody:
    catalogNumber:
    dilution:
    marker:
    wavelength: // default 555
  },
  green: {
    antibody:
    catalogNumber:
    dilution:
    marker:
    wavelength: // default 488
  },
  blue: {
    antibody:
    catalogNumber:
    dilution:
    marker:
    wavelength: // default 350
  },
}; */

const databases = require('../../connections/database');
const Readable = require('stream').Readable;

const Store = {
  image: (image, metadata = {}, fileName = 'file') => {
    return new Promise((resolve, reject) => {
      const imageOptions = {
        filename: fileName,
        mode: 'w',
        content_type: 'image/png',
        root: 'imagefs',
        metadata,
      };
      const writestream = databases.grid().createWriteStream(imageOptions);
      // create stream from buffer
      const tempStream = new Readable();
      tempStream.push(image);
      tempStream.push(null);
      tempStream.pipe(writestream);
      writestream.on('close', (file) => {
        resolve(file._id);
      });
      writestream.on('error', (err) => {
        reject(`There was an error writing the image to the database: ${err}`);
      });
    });
  },
  images: (imageObj, metadata) => {
    return new Promise((resolve, reject) => {
      const imageArr = [];
      Object.entries(imageObj).forEach(([channel, buffer]) => {
        imageArr.push({
          buffer,
          metadata: metadata[channel],
        });
      });
      const next = (index) => {
        if (index < imageArr.length) {
          Store.image(
            imageArr[index].buffer,
            imageArr[index].metadata
          )
            .then(() => {
              next(index + 1);
            })
            .catch((error) => {
              reject(`There was an error saving the images: ${error}`);
            })
          ;
        } else {
          resolve();
        }
      };
      next(0);
    });
  },
};
module.exports = Store;
