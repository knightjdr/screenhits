const Scan = {
  r: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 1] = 0;
        splitImage.bitmap.data[idx + 2] = 0;
      }
    );
    return splitImage;
  },
  g: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 0] = 0;
        splitImage.bitmap.data[idx + 2] = 0;
      }
    );
    return splitImage;
  },
  b: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 0] = 0;
        splitImage.bitmap.data[idx + 1] = 0;
      }
    );
    return splitImage;
  },
  rg: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 2] = 0;
      }
    );
    return splitImage;
  },
  rb: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 1] = 0;
      }
    );
    return splitImage;
  },
  gb: (image) => {
    const splitImage = image;
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        splitImage.bitmap.data[idx + 0] = 0;
      }
    );
    return splitImage;
  },
  rgb: (image) => {
    return image;
  },
};
module.exports = Scan;
