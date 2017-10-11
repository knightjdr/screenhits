const csv = require('csv');
const stream = require('stream');

const delimiter = {
  'text/csv': ',',
  'text/tab-separated-values': '\t',
};

const ReadFile = {
  CRISPR: (file, fileType, header, parser) => {
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
        headerParse[header[headerIndex].value] = {
          keep: parser.regex[toParseIndex].keep,
          pattern: parser.regex[toParseIndex].pattern,
        };
      });
      // line parser
      const parseLine = (data) => {
        const newEntry = {};
        Object.keys(data).forEach((column) => {
          if (headerToKeep.indexOf(column) > -1) {
            if (headerParse[column]) {
              const regex = new RegExp(headerParse[column].pattern);
              newEntry[headerMap[column]] = data[column].match(regex)[headerParse[column].keep];
            } else {
              newEntry[headerMap[column]] = data[column];
            }
          }
        });
        return newEntry;
      };
      // add record for gene
      const parsedGene = {};
      const addGeneRecord = (line) => {
        const currGene = line.gene;
        const currLine = Object.assign({}, line);
        delete currLine.gene;
        if (currGene in parsedGene) {
          parsedGene[currGene].push(currLine);
        } else {
          parsedGene[currGene] = [currLine];
        }
      };
      // create stream
      const parsedSample = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(new Buffer(file.file.data));
      bufferStream
        .pipe(csv.parse({
          columns: true,
          delimiter: delimiter[fileType],
        }))
        .on('data', (data) => {
          const line = parseLine(data);
          addGeneRecord(line);
          parsedSample.push(line);
        })
        .on('end', () => {
          console.log(parsedGene);
          resolve({
            gene: parsedGene,
            sample: parsedSample,
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
