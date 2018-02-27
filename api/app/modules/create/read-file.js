const csv = require('csv');
const query = require('../query/query');
const stream = require('stream');

const delimiter = {
  'text/csv': ',',
  'text/tab-separated-values': '\t',
};

const ReadFile = {
  CRISPR: (file, sample, fileType, header, parser, sampleID) => {
    return new Promise((resolve, reject) => {
      // define header columns to keep and needed guide information
      const guideInfo = {
        have: null,
        need: null,
        options: ['chromosome', 'guideSequence'],
      };
      const headerToKeep = [];
      const headerMap = {};
      const headerParse = {};
      // define how to map header column names to database keys
      header.forEach((column) => {
        headerToKeep.push(column.value);
        headerMap[column.value] = column.name;
        if (guideInfo.options.includes(column.name)) {
          guideInfo.have = column.name;
          const optionsIndex = guideInfo.options.indexOf(column.name);
          guideInfo.options.splice(optionsIndex, 1);
        }
      });
      // if a needed piece of guide information is missing, specify it
      if (guideInfo.options.length > 0) {
        guideInfo.need = guideInfo.options[0];
      }
      // declare how to parse columns if necessary
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
      const parseLine = (data, guides) => {
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
              // get missing guide info if current column is a lookup value
              if (headerMap[column] === guideInfo.have) {
                const guidesIndex = guides.findIndex((guide) => {
                  return guide[guideInfo.have] === newEntry[headerMap[column]];
                });
                newEntry[guideInfo.need] = guidesIndex > -1 ?
                  guides[guidesIndex][guideInfo.need]
                  :
                  null
                ;
              }
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

      const readFile = (guides) => {
        return new Promise((resolveRead, rejectRead) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(new Buffer(file.file.data));
          bufferStream
            .pipe(csv.parse({
              columns: true,
              delimiter: delimiter[fileType],
            }))
            .on('data', (data) => {
              const line = parseLine(data, guides);
              // addRecord(line, 'gene');
              // addRecord(line, 'guideSequence');
              parsed.sample.push(line);
            })
            .on('end', () => {
              resolveRead({
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
              rejectRead(error);
            })
          ;
        });
      };

      // get KO library from screen
      query.get('screen', { _id: sample.group.screen }, { other: 1 }, 'findOne')
        .then((screen) => {
          return query.get('libraries', { name: screen.other.library }, {}, 'findOne');
        })
        .then((library) => {
          const guideLibrary = library.guides;
          return readFile(guideLibrary);
        })
        .then((sampleObj) => {
          resolve(sampleObj);
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = ReadFile;
