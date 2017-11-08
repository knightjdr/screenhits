const arrayUnique = require('../helpers/array-unique');
// const CrisprDefaults = require('./CRISPR/crispr-defaults');
const query = require('../query/query');
const samplesToFiles = require('./CRISPR/samples-to-files');

const Pipeline = {
  CRISPR: {
    init: (item, folder) => {
      return new Promise((resolve) => {
        // retrieve sample information
        let sampleIDs = [];
        item.design.forEach((sampleSet) => {
          const newSamples = sampleSet.controls.concat(sampleSet.replicates);
          sampleIDs = sampleIDs.concat(newSamples);
        });
        sampleIDs = arrayUnique(sampleIDs);

        // get samples
        query.get('sample', { _id: { $in: sampleIDs } }, { records: 1 })
          .then((samples) => {
            // write samples to files
            return samplesToFiles.fromDatabase(folder, item.design, samples);
          })
          .then((fileNames) => {
            // apply filters and normalization
          })
          .catch(() => {

          })
        ;

        /* const allParams = [];
        Object.keys(CrisprDefaults.all).forEach((key) => {
          const value = Object.prototype.hasOwnProperty.call(item, key) &&
            item.key ?
              item.key
              :
              CrisprDefaults.all[key]
          ;
          allParams.push(`-${key} ${value}`);
        });*/
      });
    },
  },
};
module.exports = Pipeline;
