const CrisprDefaults = {
  all: {
    minReadCount: 30,
    minGuides: 4,
    norm: true,
    normCount: 10000000,
  },
  BAGEL: {
    bootstrapIter: 1000,
    essentialVersion: 'v1',
  },
  drugZ: {
    nonEssentialVersion: 'v1',
    pseudoCount: 5,
    removeGenes: '',
  },
  MAGeCKmle: {
    adjustMethod: '',
    genesVarModeling: 1000,
    permutationRounds: 10,
    removeOutliers: false,
  },
  MAGeCKtest: {
    adjustMethod: '',
    geneLfcMethod: 'median',
    geneTestFdrThreshold: 0.25,
    varianceFromAllSamples: false,
  },
  RANKS: {},
};
module.exports = CrisprDefaults;
