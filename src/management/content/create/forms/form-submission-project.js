const FormatSubmission = (form, props) => {
  const submitObj = {};
  submitObj['creator-email'] = props.user.email;
  submitObj['creator-name'] = props.user.name;
  submitObj.description = form.description;
  submitObj.lab = props.user.lab ? props.user.lab : null;
  submitObj.name = form.name;
  submitObj['owner-email'] = props.user.email;
  submitObj['owner-name'] = props.user.name;
  submitObj.permission = form.permission;
  submitObj.target = 'project';
  return submitObj;
};
export default FormatSubmission;