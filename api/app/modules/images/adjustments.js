const Jimp = require('jimp');

const Adjustments = {
  brightness: (pixelValue, brightness) => {
    return Adjustments.truncate(pixelValue + brightness);
    // return pixelValue > 0 ? Adjustments.truncate(pixelValue + brightness) : 0;
  },
  brightContrast: (image, channel, brightness = 0, contrast = 0) => {
    return new Promise((resolve, reject) => {
      const channelIndices = {
        red: 0,
        green: 1,
        blue: 2,
      };
      const channelIndex = channelIndices[channel];
      const brightnessAdjustment = brightness * 255;
      const contrast255 = contrast * 255;
      const contrastAdjustment = (259 * (contrast255 + 255)) / (255 * (259 - contrast255));
      Jimp.read(image)
        .then((jimpImage) => {
          jimpImage
            .scan(
              0,
              0,
              jimpImage.bitmap.width,
              jimpImage.bitmap.height,
              function adjustBC(x, y, idx) {
                this.bitmap.data[idx + channelIndex] = Adjustments.brightness(
                  this.bitmap.data[idx + channelIndex],
                  brightnessAdjustment
                );
                this.bitmap.data[idx + channelIndex] = Adjustments.contrast(
                  this.bitmap.data[idx + channelIndex],
                  contrastAdjustment
                );
              }
            )
            .getBuffer('image/png', (bufferErr, buffer) => {
              resolve(buffer);
            })
          ;
        })
        .catch((error) => {
          reject(`There was an error with Jimp updating the image: ${error}`);
        })
      ;
    });
  },
  contrast: (pixelValue, contrast) => {
    return Adjustments.truncate((contrast * (pixelValue - 128)) + 128);
    /* return pixelValue > 0 ?
      Adjustments.truncate((contrast * (pixelValue - 128)) + 128)
      :
      0
    ; */
  },
  truncate: (value) => {
    if (value < 0) {
      return 0;
    } else if (value > 255) {
      return 255;
    }
    return value;
  },
};
module.exports = Adjustments;
