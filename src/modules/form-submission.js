/* global FormData */

const FormatSubmission = {
  experiment: (form, user, selected) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.name = form.name;
    submitObj.project = selected.project;
    submitObj.protocols = form.protocols;
    submitObj.screen = selected.screen;
    submitObj.target = 'experiment';
    // optional fields
    if (form.comment) {
      submitObj.comment = form.comment;
    }
    if (form.concentration) {
      submitObj.concentration = form.concentration;
    }
    if (form.timepoint) {
      submitObj.timepoint = form.timepoint;
    }
    return submitObj;
  },
  project: (form, user) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.description = form.description;
    submitObj.lab = user.lab ? user.lab : null;
    submitObj.name = form.name;
    submitObj.ownerEmail = user.email;
    submitObj.ownerName = user.name;
    submitObj.permission = form.permission;
    submitObj.target = 'project';
    // optional fields
    if (form.comment) {
      submitObj.comment = form.comment;
    }
    return submitObj;
  },
  sample: (form, file, user, selected, screenType, parser) => {
    const submitObj = new FormData();
    submitObj.append('creatorEmail', user.email);
    submitObj.append('creatorName', user.name);
    submitObj.append('experiment', selected.experiment);
    submitObj.append('name', form.name);
    submitObj.append('project', selected.project);
    submitObj.append('screen', selected.screen);
    submitObj.append('target', 'sample');
    submitObj.append('type', screenType);
    // optional fields
    if (form.comment) {
      submitObj.append('comment', form.comment);
    }
    if (form.concentration) {
      submitObj.append('concentration', form.concentration);
    }
    if (form.fileType) {
      submitObj.append('fileType', form.fileType);
    }
    if (form.replicate) {
      submitObj.append('replicate', form.replicate);
    }
    if (form.timepoint) {
      submitObj.append('timepoint', form.timepoint);
    }
    submitObj.append('file', file.file);
    submitObj.append('header', JSON.stringify(file.header));
    submitObj.append('parser', JSON.stringify(parser));
    return submitObj;
  },
  screen: (form, user, selected) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.cell = form.cell;
    submitObj.cellID = form.cellID;
    submitObj.cellMods = form.cellMods;
    submitObj.drugs = form.drugs;
    submitObj.name = form.name;
    submitObj.other = {};
    submitObj.project = selected.project;
    submitObj.species = form.species;
    submitObj.taxonID = form.taxonID;
    submitObj.target = 'screen';
    submitObj.type = form.type;
    // screen type specific fields
    if (form.other) {
      Object.keys(form.other).forEach((field) => {
        submitObj.other[field] = form.other[field];
      });
    }
    // optional fields
    if (form.comment) {
      submitObj.comment = form.comment;
    }
    if (form.condition) {
      submitObj.condition = form.condition;
    }
    return submitObj;
  },
};
export default FormatSubmission;
