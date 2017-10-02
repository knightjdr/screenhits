const FormatSubmission = (form, user, selected) => {
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
};
export default FormatSubmission;
