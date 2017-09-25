const FormatSubmission = (form, user) => {
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
};
export default FormatSubmission;
