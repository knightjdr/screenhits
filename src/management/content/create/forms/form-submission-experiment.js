const FormatSubmission = (form, props, selected) => {
  const submitObj = {};
  submitObj['creator-email'] = props.user.email;
  submitObj['creator-name'] = props.user.name;
  if (form.concentration) {
    submitObj.concentration = form.concentration;
  }
  submitObj.description = form.description;
  submitObj.name = form.name;
  submitObj.protocols = selected.protocols;
  submitObj.timepoint = selected.timepoint;
  submitObj.target = 'experiment';
  return submitObj;
};
export default FormatSubmission;
