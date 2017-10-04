import ReactFileReader from 'react-file-reader';
import Blob from 'blob';

// reads the first line of a file
const fileReader = {
  fileWrapper: (file, encoding) => {
    const self = this;
    self.readChunk = (offset, length, callback) => {
      const reader = new ReactFileReader();
      reader.onloadend = (progress) => {
        let buffer;
        if (reader.result) {
          buffer = new Int8Array(reader.result, 0);
          buffer.slice = buffer.subarray;
        }
        callback(progress.err, buffer, progress.loaded);
      };
      reader.readAsArrayBuffer(file.slice(offset, offset + length));
    };
    self.decode = (buffer, callback) => {
      const reader = new ReactFileReader();
      reader.onloadend = (progress) => {
        callback(progress.currentTarget.result);
      };
      if (typeof encoding !== 'undefined') {
        reader.readAsText(new Blob([buffer]), encoding);
      } else {
        reader.readAsText(new Blob([buffer]));
      }
    };
    self.getSize = () => {
      return file.size;
    };
  },
  lineNavigator: (file, options = {}) => {
    const self = this;
    const bomUtf8 = [239, 187, 191];
    const bomUtf16le = [255, 254];
    // options init
    const readOptions = Object.assign({}, options);
    const encoding = readOptions.encoding ? readOptions.encoding : 'utf8';
    const chunkSize = readOptions.chunkSize ? readOptions.chunkSize : 1024 * 4;
    const throwOnLongLines = readOptions.throwOnLongLines !== undefined ?
      readOptions.throwOnLongLines
      :
      false
    ;
    const milestones = [];

    const arrayStartsWith = (array, startsWith) => {
      for (let i = 0; i < array.length && i < startsWith.length; i += 1) {
        if (array[i] !== startsWith[i]) {
          return false;
        }
        if (i === startsWith.length - 1) {
          return true;
        }
      }
      return false;
    };

    const wrapper = fileReader.fileWrapper(file, encoding);
    const oldFileSize = wrapper.getSize();
    const getFileSize = (position) => {
      return oldFileSize > position ?
        oldFileSize
        : wrapper.getSize(file)
      ;
    };

    const getProgressSimple = (position) => {
      const size = getFileSize(position);
      return Math.round((100 * position) / size);
    };

    self.readSomeLines = (index, callback) => {
      let place = self.getPlaceToStart(index, milestones);
      wrapper.readChunk(
        place.offset,
        chunkSize,
        function readChunkCallback(err, buffer, bytesRead) {
          if (err) {
            console.log(err);
            return callback(err, index);
          }
          const isEof = bytesRead < chunkSize;
          let chunkContent = self.examineChunk(buffer, bytesRead, isEof);
          if (chunkContent === undefined) {
            // Line is longer than a chunkSize
            if (bytesRead > 0) {
              if (throwOnLongLines) {
                return callback(`Line ${index} is longer than chunk size (${chunkSize})`, index);
              }
              chunkContent = {
                lines: 1,
                length: bytesRead - 1,
                noLineEnding: true,
              };
            } else {
              return callback(`Line ${index} is out of index, last available:
                ${(milestones.length > 0 ? milestones[milestones.length - 1].lastLine : 'none')}`, index);
            }
          }
          const inChunk = {
            firstLine: place.firstLine,
            lastLine: place.firstLine + (chunkContent.lines - 1),
            offset: place.offset,
            length: chunkContent.length + 1,
          };
          if (place.isNew) {
            milestones.push(inChunk);
          }
          const targetInChunk = inChunk.firstLine <= index && index <= inChunk.lastLine;
          if (targetInChunk) {
            const bomOffset = place.offset !== 0 ? 0 : self.getBomOffset(buffer, encoding);
            wrapper.decode(buffer.slice(bomOffset, inChunk.length), (text) => {
              let lines = text.split(/\r\n|\n|\r/);
              if (!isEof && !chunkContent.noLineEnding) {
                lines = lines.slice(0, lines.length - 1);
              }
              if (index !== inChunk.firstLine) {
                lines = lines.splice(index - inChunk.firstLine);
              }
              callback(
                undefined,
                index,
                lines,
                isEof,
                getProgressSimple(inChunk.offset + inChunk.length),
                inChunk,
              );
            });
          } else if (!isEof) {
            place = self.getPlaceToStart(index, milestones);
            wrapper.readChunk(place.offset, chunkSize, readChunkCallback);
          } else {
            return callback(`Line ${index} is out of index, last available: ${inChunk.lastLine}`, index);
          }
          return null;
        }
      );
    };

    self.readLines = (index, count, callback) => {
      if (count === 0) {
        return callback(undefined, index, [], false, 0);
      }
      let result = [];
      self.readSomeLines(
        index,
        function readLinesCallback(err, partIndex, lines, isEof, progress, inChunk) {
          if (err) {
            return callback(err, index);
          }
          const resultEof = !isEof ?
            false
            :
            partIndex + lines.length <= index + count
          ;
          result = result.concat(lines);
          if (result.length >= count || isEof) {
            result = result.splice(0, count);
            const currProgress = self.getProgress(
              inChunk, index + (result.length - 1),
              getFileSize(inChunk.offset + inChunk.length),
            );
            return callback(undefined, index, result, resultEof, currProgress);
          }
          self.readSomeLines(partIndex + lines.length, readLinesCallback);
          return null;
        }
      );
      return null;
    };
    self.find = (regex, index, callback) => {
      self.readSomeLines(
        index,
        function readSomeLinesHandler(err, firstLine, lines, isEof) {
          if (err) {
            return callback(err);
          }
          for (let i = 0; i < lines.length; i += 1) {
            const match = self.searchInLine(regex, lines[i]);
            if (match) {
              return callback(undefined, firstLine + i, match);
            }
          }
          if (isEof) {
            return callback();
          }
          self.readSomeLines(firstLine + lines.length + 1, readSomeLinesHandler);
          return null;
        }
      );
    };
    self.findAll = (regex, index, limit, callback) => {
      const results = [];
      self.readSomeLines(index, function readSomeLinesHandler(err, firstLine, lines, isEof) {
        if (err) {
          return callback(err, index);
        }
        for (let i = 0; i < lines.length; i += 1) {
          const match = self.searchInLine(regex, lines[i]);
          if (match) {
            match.index = firstLine + i;
            results.push(match);
            if (results.length >= limit) {
              return callback(undefined, index, true, results);
            }
          }
        }
        if (isEof) {
          return callback(undefined, index, false, results);
        }
        self.readSomeLines(firstLine + lines.length, readSomeLinesHandler);
        return null;
      });
    };
    self.getProgress = (milestone, index, fileSize) => {
      const linesInMilestone = milestone.lastLine - (milestone.firstLine + 1);
      const indexNumberInMilestone = index - milestone.firstLine;
      const indexLineAssumablePosition = index !== milestone.lastLine
        ? (milestone.offset + milestone.length) / (linesInMilestone * indexNumberInMilestone)
        : milestone.offset + milestone.length
      ;
      return Math.floor(100 * (indexLineAssumablePosition / fileSize));
    };
    self.searchInLine = (regex, line) => {
      const match = regex.exec(line);
      return !match ?
        null
        : {
          offset: line.indexOf(match[0]),
          length: match[0].length,
          line,
        }
      ;
    };
    self.getPlaceToStart = (index, currPoint) => {
      for (let i = currPoint.length - 1; i >= 0; i -= 1) {
        if (currPoint[i].lastLine < index) {
          return {
            firstLine: currPoint[i].lastLine + 1,
            offset: currPoint[i].offset + currPoint[i].length,
            isNew: i === currPoint.length - 1,
          };
        }
      }
      return { firstLine: 0, offset: 0, isNew: currPoint.length === 0 };
    };
    self.getLineEnd = (buffer, start, end) => {
      const newLineCode = '\n'.charCodeAt(0);
      for (let i = start; i < end; i += 1) {
        if (buffer[i] === newLineCode) {
          if (i !== end && buffer[i + 1] === 0) {
            return i + 1; // it is UTF16LE and trailing zero belongs to \n
          }
          return i;
        }
      }
      return null;
    };
    self.examineChunk = (buffer, bytesRead, isEof) => {
      let lines = 0;
      let length = 0;
      let position;
      do {
        position = self.getLineEnd(buffer, length, bytesRead, isEof);
        if (position !== undefined) {
          lines += 1;
          length = position + 1;
        }
      } while (position !== undefined);
      if (isEof) {
        lines += 1;
        length = bytesRead;
      }
      return length > 0
        ? { lines, length: length - 1 }
        : undefined
      ;
    };
    self.getBomOffset = (buffer, currEncoding) => {
      switch (currEncoding.toLowerCase()) {
        case 'utf8':
          return arrayStartsWith(buffer, bomUtf8) ? bomUtf8.length : 0;
        case 'utf16le':
          return arrayStartsWith(buffer, bomUtf16le) ? bomUtf16le.length : 0;
        default:
          return 0;
      }
    };
  },
  firstLine: (inputFile) => {
    return new Promise((resolve, reject) => {
      const navigator = fileReader.lineNavigator(inputFile);
      navigator.readLines(0, 1, (err, index, lines) => {
        if (!err) {
          resolve(lines[0]);
        } else {
          reject(err);
        }
      });
    });
  },
};
export default fileReader;
