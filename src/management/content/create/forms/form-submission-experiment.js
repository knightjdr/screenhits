const FormatSubmission = (form, user, selected) => {
  const submitObj = {};
  submitObj.creatorEmail = user.email;
  submitObj.creatorName = user.name;
  submitObj.description = form.description;
  submitObj.name = form.name;
  submitObj.protocols = selected.protocols;
  submitObj.timepoint = selected.timepoint;
  submitObj.target = 'experiment';
  // optional fields
  if (form.comment) {
    submitObj.comment = form.comment;
  }
  if (form.concentration) {
    submitObj.concentration = form.concentration;
  }
  return submitObj;
};
export default FormatSubmission;
