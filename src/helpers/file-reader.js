/* global FileReader */
/* global TextDecoder */

// reads the x lines of a file
// modified from https://stackoverflow.com/a/39505307/3182448
const fileReader = {
  nLines: (inputFile, maxLines) => {
    return new Promise((resolve, reject) => {
      const CHUNK_SIZE = 50000;
      const decoder = new TextDecoder();
      let offset = 0;
      let lineCount = 0;
      let lines;
      let results = '';

      const fr = new FileReader();

      const seek = () => {
        if (lineCount === maxLines) {
          fr.abort();
          resolve(lines);
          return;
        }
        if (
          offset !== 0 &&
          offset >= inputFile.size
        ) { // We did not find all lines, but there are no more lines.
          fr.abort();
          resolve(lines);
          return;
        }
        const slice = inputFile.slice(offset, offset + CHUNK_SIZE);
        fr.readAsArrayBuffer(slice);
      };

      fr.onload = () => {
        // Use stream:true in case we cut the file in the middle of a multi-byte character
        results += decoder.decode(fr.result, { stream: true });
        lines = results.split(/[\r\n]+/);
        results = lines.pop(); // In case the line did not end yet.
        lineCount += lines.length;

        if (lineCount > maxLines) { // Read too many lines? Truncate the results.
          lines.length -= lineCount - maxLines;
          lineCount = maxLines;
        }
        offset += CHUNK_SIZE;
        seek();
      };
      fr.onerror = (error) => {
        reject(error);
      };

      seek();
    });
  },
};
export default fileReader;
