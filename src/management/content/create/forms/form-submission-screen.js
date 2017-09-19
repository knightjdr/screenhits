const FormatSubmission = (form, props, selected) => {
  const submitObj = {};
  submitObj['creator-email'] = props.user.email;
  submitObj['creator-name'] = props.user.name;
  submitObj.cell = form.cell;
  if (form.condition) {
    submitObj.condition = form.condition;
  }
  submitObj.description = form.description;
  submitObj.name = form.name;
  if (form.other) {
    Object.keys(form.other).forEach((field) => {
      submitObj[field] = form.other[field];
    });
  }
  submitObj.project = selected.project;
  submitObj.species = form.species;
  submitObj.target = 'screen';
  submitObj.type = form.type;
  return submitObj;
};
export default FormatSubmission;
