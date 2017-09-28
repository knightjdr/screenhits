// finds the active level of a selection object, based on hierarchy
const activeLevel = {
  // find highest level
  findActive: (selected) => {
    let level;
    if (selected.sample) {
      level = 'sample';
    } if (selected.experiment) {
      level = 'experiment';
    } if (selected.screen) {
      level = 'screen';
    } else {
      level = 'project';
    }
    return level;
  },
  // check if selected items exist and return
  checkSelected: (selected, data) => {
    let setSelected = {
      experiment: selected.experiment,
      project: selected.project,
      sample: selected.sample,
      screen: selected.screen,
    };
    // check if selected levels exist
    if (
      data.project &&
      data.project.findIndex((projectItem) => {
        return projectItem._id === selected.project;
      }) < 0
    ) {
      setSelected = {
        experiment: null,
        project: null,
        sample: null,
        screen: null,
      };
    } else if (
      data.screen &&
      data.screen.findIndex((screen) => {
        return screen._id === selected.screen;
      }) < 0
    ) {
      setSelected.experiment = null;
      setSelected.sample = null;
      setSelected.screen = null;
    } else if (
      data.experiment &&
      data.experiment.findIndex((experiment) => {
        return experiment._id === selected.experiment;
      }) < 0
    ) {
      setSelected.experiment = null;
      setSelected.sample = null;
    } else if (
      data.sample &&
      data.sample.findIndex((sample) => {
        return sample._id === selected.sample;
      }) < 0
    ) {
      setSelected.sample = null;
    }
    return Object.assign({}, setSelected);
  },
};
export default activeLevel;
