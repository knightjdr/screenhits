const fs = require('mz/fs');

const SampleToFiles = {
  fromDatabase: (folder, design, samples) => {
    return new Promise((resolve, reject) => {
      const errors = [];
      const fileNames = [];
      design.forEach((sampleSet) => {
        // get guides from first control sample
        const firstControlSampleIndex = samples.findIndex((sample) => {
          return sample._id === sampleSet.controls[0];
        });
        const guides = samples[firstControlSampleIndex].records.map((record) => {
          return {
            gene: record.gene,
            guide: record.guideSequence,
          };
        });

        // create file header
        let header = 'SEQID\tGENE\t';
        header += sampleSet.controls.map((control, i) => {
          return `C${i + 1}`;
        }).join('\t');
        header += '\t';
        header += sampleSet.replicates.map((control, i) => {
          return `R${i + 1}`;
        }).join('\t');
        header += '\n';

        // write to file
        const file = fs.createWriteStream(`${folder}/${sampleSet.name}.txt`);
        file.write(header);
        guides.forEach((guideEntry) => {
          let line = `${guideEntry.guide}\t${guideEntry.gene}`;
          sampleSet.controls.concat(sampleSet.replicates).forEach((_id) => {
            const sampleIndex = samples.findIndex((sample) => {
              return sample._id === _id;
            });
            const recordIndex = samples[sampleIndex].records.findIndex((record) => {
              return record.guideSequence === guideEntry.guide;
            });
            line += recordIndex > -1 ?
              `\t${samples[sampleIndex].records[recordIndex].readCount}`
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
        file.on('finish', () => {
          fileNames.push(`${sampleSet.name}.txt`);
          file.end();
        });
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
