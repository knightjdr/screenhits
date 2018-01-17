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

const storeImage = (image, metadata = {}, fileName = 'file') => {
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
};
module.exports = storeImage;
