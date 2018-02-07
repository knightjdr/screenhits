const JSZip = require('jszip');

const Zip = {
  file: (content, name, zipInstance) => {
    return new Promise((resolve) => {
      zipInstance.file(name, content);
      resolve();
    });
  },
  images: (images, folderName) => {
    return new Promise((resolve, reject) => {
      const zip = new JSZip();
      Promise.all([
        images.blue ? Zip.file(images.blue, `${folderName}/blue_channel.png`, zip) : Promise.resolve(),
        images.green ? Zip.file(images.green, `${folderName}/green_channel.png`, zip) : Promise.resolve(),
        images.merge ? Zip.file(images.merge, `${folderName}/merge_channel.png`, zip) : Promise.resolve(),
        images.original ? Zip.file(images.original, `${folderName}/original_channel.png`, zip) : Promise.resolve(),
        images.red ? Zip.file(images.red, `${folderName}/red_channel.png`, zip) : Promise.resolve(),
      ])
        .then(() => {
          zip
            .generateAsync({ type: 'nodebuffer' })
            .then((buffer) => {
              const zipB64 = buffer.toString('base64');
              resolve(zipB64);
            })
          ;
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = Zip;
