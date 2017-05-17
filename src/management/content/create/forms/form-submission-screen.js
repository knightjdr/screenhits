const FormatSubmission = (form, props) => {
  const submitObj = {};
  submitObj['creator-email'] = props.user.email;
  submitObj['creator-name'] = props.user.name;
  submitObj.cell = form.cell;
  submitObj.condition = form.condition;
  submitObj.description = form.description;
  submitObj.name = form.name;
  submitObj.species = form.species;
  submitObj.target = 'screen';
  submitObj.type = form.type;
  return submitObj;
};
export default FormatSubmission;
