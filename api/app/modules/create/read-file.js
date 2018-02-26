const csv = require('csv');
const stream = require('stream');

const delimiter = {
  'text/csv': ',',
  'text/tab-separated-values': '\t',
};

const ReadFile = {
  CRISPR: (file, sample, fileType, header, parser, sampleID) => {
    return new Promise((resolve, reject) => {
      // define header columns to keep
      const headerToKeep = [];
      const headerMap = {};
      const headerParse = {};
      header.forEach((column) => {
        headerToKeep.push(column.value);
        headerMap[column.value] = column.name;
      });
      parser.toParse.forEach((toParseIndex) => {
        const headerIndex = header.findIndex((column) => {
          return column.index === toParseIndex;
        });
        const patternsIndex = parser.regex[toParseIndex].patternsIndex;
        headerParse[header[headerIndex].value] = {
          keep: parser.regex[toParseIndex].keep,
          pattern: parser.regex[toParseIndex].patterns[patternsIndex],
        };
      });
      // line parser
      const parseLine = (data) => {
        const newEntry = {};
        Object.keys(data).forEach((column) => {
          if (headerToKeep.indexOf(column) > -1) {
            if (headerParse[column]) {
              const regex = new RegExp(headerParse[column].pattern);
              const matched = data[column].match(regex);
              newEntry[headerMap[column]] = matched ?
                matched[headerParse[column].keep]
                :
                data[column];
            } else {
              newEntry[headerMap[column]] = data[column];
            }
          }
        });
        return newEntry;
      };
      // add record for genes and guides
      const parsed = {
        gene: {},
        guideSequence: {},
        sample: [],
      };
      /* const addRecord = (line, type) => {
        const currKey = line[type];
        const currLine = Object.assign({}, line);
        delete currLine[type];
        const currEntry = Object.assign(
          {},
          currLine,
          {
            sample: sampleID,
          }
        );
        if (currKey in parsed[type]) {
          parsed[type][currKey].push(currEntry);
        } else {
          parsed[type][currKey] = [currEntry];
        }
      }; */
      const bufferStream = new stream.PassThrough();
      bufferStream.end(new Buffer(file.file.data));
      bufferStream
        .pipe(csv.parse({
          columns: true,
          delimiter: delimiter[fileType],
        }))
        .on('data', (data) => {
          const line = parseLine(data);
          // addRecord(line, 'gene');
          // addRecord(line, 'guideSequence');
          parsed.sample.push(line);
        })
        .on('end', () => {
          resolve({
            // gene: parsed.gene,
            // guide: parsed.guideSequence,
            sample: Object.assign(
              {},
              sample,
              {
                _id: sampleID,
                records: parsed.sample,
              }
            ),
          });
        })
        .on('error', (error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = ReadFile;
