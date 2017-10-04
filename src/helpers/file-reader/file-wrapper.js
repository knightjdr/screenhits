import ReactFileReader from 'react-file-reader';
import Blob from 'blob';

/* https://github.com/anpur/line-navigator Anton Purin MIT 2016 */
function FileWrapper(file, encoding) {
  const self = this;
  self.readChunk = function (offset, length, callback) {
    const reader = new ReactFileReader();
    reader.onloadend = function onloadend(progress) {
      let buffer;
      if (reader.result) {
        buffer = new Int8Array(reader.result, 0);
        buffer.slice = buffer.subarray;
      }
      callback(progress.err, buffer, progress.loaded);
    };
    reader.readAsArrayBuffer(file.slice(offset, offset + length));
  };
  self.decode = function decode(buffer, callback) {
    const reader = new ReactFileReader();
    reader.onloadend = function onloadend(progress) {
      callback(progress.currentTarget.result);
    };
    if (typeof encoding !== 'undefined') {
      reader.readAsText(new Blob([buffer]), encoding);
    } else {
      reader.readAsText(new Blob([buffer]));
    }
  };
  self.getSize = function getSize() {
    return file.size;
  };
}

export default FileWrapper;
