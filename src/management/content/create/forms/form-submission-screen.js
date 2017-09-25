const FormatSubmission = (form, user, selected) => {
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
};
export default FormatSubmission;
