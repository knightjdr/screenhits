const Format = {
  blankState: {
    project: {
      formData: {
        description: '',
        name: '',
        permission: 'lr',
      },
      errors: {
        description: null,
        name: null,
        permission: null,
      },
      warning: false,
    },
    screen: {
      formData: {
        cell: '',
        condition: '',
        description: '',
        name: '',
        species: '',
        type: null,
      },
      errors: {
        description: null,
        name: null,
        type: null,
      },
      warning: false,
    },
  },
  project: (form, props) => {
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
  },
  screen: (form, props) => {
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
  },
};
export default Format;
