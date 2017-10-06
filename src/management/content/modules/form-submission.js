const FormatSubmission = {
  experiment: (form, user, selected) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.description = form.description;
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
  sample: (form, user, selected) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.experiment = selected.experiment;
    submitObj.name = form.name;
    submitObj.project = selected.project;
    submitObj.screen = selected.screen;
    submitObj.type = 'sample';
    // optional fields
    if (form.comment) {
      submitObj.comment = form.comment;
    }
    if (form.concentration) {
      submitObj.concentration = form.concentration;
    }
    if (form.replicate) {
      submitObj.replicate = form.replicate;
    }
    if (form.timepoint) {
      submitObj.timepoint = form.timepoint;
    }
    return submitObj;
  },
  screen: (form, user, selected) => {
    const submitObj = {};
    submitObj.creatorEmail = user.email;
    submitObj.creatorName = user.name;
    submitObj.cell = form.cell;
    submitObj.description = form.description;
    submitObj.name = form.name;
    submitObj.other = {};
    submitObj.project = selected.project;
    submitObj.species = form.species;
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
