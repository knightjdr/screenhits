import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import DefaultProps from '../../../../types/default-props';
import TemplateContent from './template-content';
import { getData } from '../../../../state/get/data-actions';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { resetPut, submitPut } from '../../../../state/put/actions';
import { resetDelete, submitDelete } from '../../../../state/delete/actions';
import { userProp } from '../../../../types/index';

const defaultErrors = {
  templateName: '',
};

const defaultState = {
  dialogBoolean: false,
  display: false,
  edit: false,
  editFieldName: '',
  editTemplate: {
    _id: '',
    creationDate: '',
    creatorEmail: '',
    creatorName: '',
    name: '',
    subSections: [],
    target: 'template',
  },
  errors: defaultErrors,
  fields: [],
  fieldError: '',
  fieldName: '',
  new: false,
  templateName: '',
  selectedTemplate: null,
  selectedTemplateIndex: null,
};

class TemplateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(defaultState));
  }
  componentWillMount = () => {
    this.props.templateGet();
  }
  componentWillReceiveProps = (nextProps) => {
    const { deleteState, postState, templates, putState } = nextProps;
    let newState = {};
    // on a succseful creation, set the selected template to the last array item
    if (
      postState.message &&
      !postState.didSubmitFail
    ) {
      newState = Object.assign(
        {},
        newState,
        {
          display: true,
          edit: false,
          new: false,
          templateName: '',
          selectedTemplate: templates.items[templates.items.length - 1]._id,
          selectedTemplateIndex: templates.items.length - 1,
        },
      );
    }
    // on successful delete
    if (
      this.props.deleteState.isDelete &&
      !deleteState.isDelete &&
      !deleteState.didDeleteFail
    ) {
      newState = Object.assign(
        {},
        newState,
        {
          display: false,
          selectedTemplate: null,
          selectedTemplateIndex: null,
        },
      );
    }
    // on successful edit
    if (
      this.props.putState.isPut &&
      !putState.isPut &&
      !putState.didPutFail
    ) {
      this.cancelEdit();
    }
    this.setState(newState);
  }
  componentWillUnmount = () => {
    this.resetMessages();
  }
  addField = (fieldName) => {
    this.setState((prevState) => {
      // make sure fieldName doesn't exist
      let alreadyExists = fieldName === 'name';
      let newState;
      prevState.fields.forEach((field) => {
        if (field.name === fieldName) {
          alreadyExists = true;
        }
      });
      if (alreadyExists) {
        newState = {
          fieldError: `A field named ${fieldName} already exists`,
        };
      } else if (fieldName) {
        newState = {
          fieldError: '',
          fieldName: '',
          fields: [
            ...prevState.fields,
            {
              name: fieldName,
              content: '',
            },
          ],
        };
      }
      return newState;
    });
  }
  addFieldEdit = (fieldName) => {
    this.setState((prevState) => {
      // make sure fieldName doesn't exist
      let alreadyExists = fieldName === 'name';
      let newState;
      prevState.editTemplate.subSections.forEach((field) => {
        if (field.name === fieldName) {
          alreadyExists = true;
        }
      });
      if (alreadyExists) {
        newState = {
          editFieldError: `A field named ${fieldName} already exists`,
        };
      } else if (fieldName) {
        const newEditTemplate = JSON.parse(JSON.stringify(prevState.editTemplate));
        newEditTemplate.subSections.push({
          name: fieldName,
          content: '',
        });
        newState = {
          editFieldError: '',
          editFieldName: '',
          editTemplate: newEditTemplate,
        };
      }
      return newState;
    });
  }
  cancel = () => {
    this.resetMessages();
    this.setState(JSON.parse(JSON.stringify(defaultState)));
  }
  cancelEdit = () => {
    this.setState({
      display: true,
      edit: false,
      editTemplate: {
        _id: '',
        creationDate: '',
        creatorEmail: '',
        creatorName: '',
        name: '',
        subSections: [],
        target: 'template',
      },
      new: false,
    });
  }
  changeEdit = () => {
    this.setState((prevState, props) => {
      return {
        display: false,
        edit: true,
        editTemplate: props.templates.items[this.state.selectedTemplateIndex],
        new: false,
      };
    });
  }
  changeNew = () => {
    this.resetMessages();
    this.setState({
      display: false,
      edit: false,
      new: true,
      selectedTemplate: null,
      selectedTemplateIndex: null,
    });
  }
  createTemplate = () => {
    if (!this.state.templateName) {
      this.setState((prevState) => {
        const newErrors = Object.assign({}, prevState.errors);
        newErrors.templateName = 'The template must be given a name';
        return {
          errors: newErrors,
        };
      });
    } else {
      const templateObj = {
        creatorEmail: this.props.user.email,
        creatorName: this.props.user.name,
        lab: this.props.user.lab,
        name: this.state.templateName,
        subSections: JSON.parse(JSON.stringify(this.state.fields)),
        target: 'template',
      };
      this.resetMessages();
      this.props.createTemplate(templateObj);
    }
  }
  deleteTemplate = (_id) => {
    this.dialogClose();
    this.resetMessages();
    this.props.delete(_id);
  }
  dialogClose = () => {
    this.setState({
      dialogBoolean: false,
    });
  }
  dialogOpen = () => {
    this.setState({
      dialogBoolean: true,
    });
  }
  editChangeField = (field, value, index = false) => {
    this.setState((prevState) => {
      const newEditTemplate = JSON.parse(JSON.stringify(prevState.editTemplate));
      if (!Number.isInteger(index)) {
        newEditTemplate[field] = value;
      } else {
        newEditTemplate.subSections[index] = {
          name: newEditTemplate.subSections[index].name,
          content: value,
        };
      }
      return {
        editTemplate: newEditTemplate,
      };
    });
  }
  editRemoveField = (index) => {
    this.setState((prevState) => {
      const newEditTemplate = JSON.parse(JSON.stringify(prevState.editTemplate));
      newEditTemplate.subSections.splice(index, 1);
      return {
        editTemplate: newEditTemplate,
      };
    });
  }
  inputChange = (field, value) => {
    const newState = {};
    newState[field] = value;
    this.setState((prevState) => {
      newState.errors = Object.assign({}, prevState.errors);
      if (
        value &&
        newState.errors[field]
      ) {
        newState.errors[field] = '';
      }
      return newState;
    });
  }
  inputChangeEdit = (value) => {
    this.setState({
      editFieldError: '',
      editFieldName: value,
    });
  }
  inputChangeSubField = (index, value) => {
    this.setState((prevState) => {
      const newFields = JSON.parse(JSON.stringify(prevState.fields));
      newFields[index] = {
        name: newFields[index].name,
        content: value,
      };
      return {
        fields: newFields,
      };
    });
  }
  templateChange = (value) => {
    this.resetMessages();
    this.setState((prevState, props) => {
      return {
        display: true,
        edit: false,
        new: false,
        selectedTemplate: value,
        selectedTemplateIndex: props.templates.items.findIndex((template) => {
          return template._id === value;
        }),
      };
    });
  }
  removeField = (index) => {
    this.setState((prevState) => {
      const newFields = JSON.parse(JSON.stringify(prevState.fields));
      newFields.splice(index, 1);
      return {
        fields: newFields,
      };
    });
  }
  resetMessages = () => {
    if (this.props.deleteState.message) {
      this.props.resetDelete('template');
    }
    if (this.props.postState.message) {
      this.props.resetPost('template');
    }
    if (this.props.putState.message) {
      this.props.resetPut('template');
    }
  }
  updateTemplate = () => {
    this.resetMessages();
    this.props.update(
      this.state.editTemplate._id,
      this.state.editTemplate
    );
  }
  render() {
    return (
      <TemplateContent
        addField={ this.addField }
        addFieldEdit={ this.addFieldEdit }
        back={ this.props.cancelMenuAction }
        cancel={ this.cancel }
        cancelEdit={ this.cancelEdit }
        changeEdit={ this.changeEdit }
        changeNew={ this.changeNew }
        createTemplate={ this.createTemplate }
        deleteMessages={ this.props.deleteState }
        deleteTemplate={ this.deleteTemplate }
        dialog={ {
          bool: this.state.dialogBoolean,
          close: this.dialogClose,
          open: this.dialogOpen,
        } }
        details={ this.state.details }
        display={ this.state.display }
        edit={ this.state.edit }
        editChangeField={ this.editChangeField }
        editFieldError={ this.state.editFieldError }
        editFieldName={ this.state.editFieldName }
        editMessages={ this.props.putState }
        editTemplate={ this.state.editTemplate }
        editRemoveField={ this.editRemoveField }
        errors={ this.state.errors }
        fields={ this.state.fields }
        fieldError={ this.state.fieldError }
        fieldName={ this.state.fieldName }
        inputChange={ this.inputChange }
        inputChangeEdit={ this.inputChangeEdit }
        inputChangeSubField={ this.inputChangeSubField }
        new={ this.state.new }
        postState={ this.props.postState }
        templateChange={ this.templateChange }
        templateName={ this.state.templateName }
        templates={ this.props.templates }
        removeField={ this.removeField }
        selectedTemplate={ this.state.selectedTemplate }
        selectedTemplateIndex={ this.state.selectedTemplateIndex }
        updateTemplate={ this.updateTemplate }
      />
    );
  }
}

TemplateContentContainer.defaultProps = {
  user: DefaultProps.user,
};

TemplateContentContainer.propTypes = {
  cancelMenuAction: PropTypes.func.isRequired,
  createTemplate: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  deleteState: PropTypes.shape({
    _id: PropTypes.number,
    didDeleteFail: PropTypes.bool,
    message: PropTypes.string,
    isDelete: PropTypes.bool,
  }).isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  templateGet: PropTypes.func.isRequired,
  templates: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  putState: PropTypes.shape({
    _id: PropTypes.number,
    didPutFail: PropTypes.bool,
    message: PropTypes.string,
    isPut: PropTypes.bool,
  }).isRequired,
  resetDelete: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
  resetPut: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    createTemplate: (obj) => {
      dispatch(submitPost('template', obj, false));
    },
    delete: (_id) => {
      dispatch(submitDelete(_id, 'template', {}));
    },
    templateGet: () => {
      dispatch(getData('template', {}, null));
    },
    resetPut: () => {
      dispatch(resetPut('template'));
    },
    resetDelete: () => {
      dispatch(resetDelete('template'));
    },
    resetPost: () => {
      dispatch(resetPost('template'));
    },
    update: (_id, obj) => {
      dispatch(submitPut(_id, obj, 'template'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    deleteState: state.delete.template,
    postState: state.post.template,
    putState: state.put.template,
    templates: state.available.template,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateContentContainer);

export default Container;
