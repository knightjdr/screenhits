/* global FileReader */

const acceptableTypes = [
  'image/bmp',
  'image/jpeg',
  'image/png',
  'image/tiff',
];

const imageReader = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve();
    } else if (
      file &&
      acceptableTypes.includes(file.type)
    ) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = () => {
        resolve([fr.result]);
      };
      fr.onerror = (error) => {
        reject(error);
      };
    } else {
      reject('Invalid image type. Valid types include: BMP, JPEG, PNG and TIFF');
    }
  });
};
export default imageReader;
