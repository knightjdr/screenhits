const imageType = require('image-type');

const FileType = {
  check: (image) => { // takes an image buffer
    const type = imageType(image);
    switch (type.mime) {
      case 'bmp':
        return type;
      case 'jpg':
        return type;
      case 'png':
        return type;
      case 'tif':
        return type;
      default:
        return null;
    }
  },
};
module.exports = FileType;
