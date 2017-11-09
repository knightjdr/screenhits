const deepEqual = require('deep-equal');
const fs = require('mz/fs');

const SampleToFiles = {
  fromDatabase: (folder, design, samples) => {
    return new Promise((resolve, reject) => {
      const errors = [];
      const fileNames = [];

      // check if samples have same guide list (in the same order)
      const compareGuideOrder = (currSamples) => {
        const expectedGuides = currSamples[0].records.map((record) => {
          return record.quideSequence;
        });
        const sameGuideOrder = currSamples.every((sample, i) => {
          if (i === 0) {
            return true;
          }
          const currGuides = sample.records.map((record) => {
            return record.quideSequence;
          });
          return deepEqual(currGuides, expectedGuides);
        });
        return sameGuideOrder;
      };

      // create header
      const createHeader = (controls, replicates) => {
        let header = 'SEQID\tGENE\t';
        header += controls.map((control, i) => {
          return `C${i + 1}`;
        }).join('\t');
        header += '\t';
        header += replicates.map((control, i) => {
          return `R${i + 1}`;
        }).join('\t');
        header += '\n';
        return header;
      };

      // get guides to print out
      const getGuides = (arr) => {
        let guides = [];
        arr.forEach((sample) => {
          const currGuides = sample.records.map((record) => {
            return {
              gene: record.gene,
              guide: record.guideSequence,
            };
          });
          guides = guides.concat(currGuides);
        });
        // remove duplicates
        if (arr.length > 1) {
          guides = guides.filter((guide, index, self) => {
            return self.findIndex((g) => {
              return g.gene === guide.gene && g.guide === guide.guide;
            }) === index;
          });
        }
        return guides;
      };

      // write to file where sampleshave the same guide set
      const writeInOrder = (guides, header, sampleSet, currSamples) => {
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        guides.forEach((guideEntry, i) => {
          let line = `${guideEntry.guide}\t${guideEntry.gene}`;
          sampleSet.controls.concat(sampleSet.replicates).forEach((_id) => {
            const sampleIndex = currSamples.findIndex((sample) => {
              return sample._id === _id;
            });
            line += `\t${currSamples[sampleIndex].records[i].readCount}`;
          });
          line += '\n';
          file.write(line);
        });
        file.on('error', () => {
          errors.push(`Input file could not be created from the database,
            for sample ${sampleSet.name}`
          );
        });
        fileNames.push(`${sampleSet.name}.txt`);
        file.end();
      };

      // write to file where samples do not have the same guide set
      const writeLineByLine = (guides, header, sampleSet, currSamples) => {
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        guides.forEach((guideEntry) => {
          let line = `${guideEntry.guide}\t${guideEntry.gene}`;
          sampleSet.controls.concat(sampleSet.replicates).forEach((_id) => {
            const sampleIndex = currSamples.findIndex((sample) => {
              return sample._id === _id;
            });
            const recordIndex = currSamples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            line += recordIndex > -1 ?
              `\t${currSamples[sampleIndex].records[recordIndex].readCount}`
              :
              0
            ;
          });
          line += '\n';
          file.write(line);
        });
        file.on('error', () => {
          errors.push(`Input file could not be created from the database,
            for sample ${sampleSet.name}`
          );
        });
        console.log('slow done');
        fileNames.push(`${sampleSet.name}.txt`);
        file.end();
      };

      design.forEach((sampleSet) => {
        // get currSamples to use
        const currSamples = sampleSet.controls.concat(sampleSet.replicates).map((_id) => {
          const sampleIndex = samples.findIndex((sample) => { return sample._id === _id; });
          return samples[sampleIndex];
        });
        // write to file
        const header = createHeader(sampleSet.controls, sampleSet.replicates);
        const sameFormat = compareGuideOrder(currSamples);
        if (sameFormat) {
          const guides = getGuides([currSamples[0]]);
          writeInOrder(guides, header, sampleSet, currSamples);
        } else {
          const guides = getGuides(samples);
          writeLineByLine(guides, header, sampleSet, currSamples);
        }
      });
      if (errors.length === 0) {
        resolve(fileNames);
      } else {
        reject(errors.join('. '));
      }
    });
  },
};
module.exports = SampleToFiles;
