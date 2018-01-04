const arrayUnique = require('../helpers/array-unique');
const BAGEL = require('./CRISPR/bagel');
const drugZ = require('./CRISPR/drugz');
const MAGeCKtest = require('./CRISPR/mageck-test');
const Permission = require('../permission/permission');
const query = require('../query/query');
const RANKS = require('./CRISPR/ranks');
const UpdateTask = require('./update-task');

const analysisScripts = {
  BAGEL,
  drugZ,
  MAGeCKtest,
  RANKS,
};

const Pipeline = {
  CRISPR: {
    init: (analysisDetails, task, writeLog) => {
      return new Promise((resolve, reject) => {
        // get list of samples
        let sampleIDs = [];
        analysisDetails.design.forEach((sampleSet) => {
          const newSamples = sampleSet.controls.concat(sampleSet.replicates);
          sampleIDs = sampleIDs.concat(newSamples);
        });
        sampleIDs = arrayUnique(sampleIDs);

        // get samples from database
        const taskStatus = {
          status: 'Getting samples',
          step: 'Database query',
        };
        UpdateTask.sync(task.id, taskStatus);
        let formSamples;
        Promise.all([
          query.get('sample', { _id: { $in: sampleIDs } }, { group: 1, records: 1 }),
          query.get('users', { email: task.userEmail }, { }, 'findOne'),
        ])
          .then((values) => {
            formSamples = values[0];
            const projects = values[0].map((sample) => { return sample.group.project; });
            return Permission.canView.projects(projects, values[1]);
          })
          .then(() => {
            // run analysis pipeline
            return analysisScripts[analysisDetails.analysisType].run(
              formSamples,
              analysisDetails,
              task,
              writeLog
            );
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
        ;
      });
    },
  },
};
module.exports = Pipeline;
