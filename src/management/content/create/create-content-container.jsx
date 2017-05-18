import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import BlankStateProject from './forms/blank-state-project';
import BlankStateScreen from './forms/blank-state-screen';
import CreateContent from './create-content';
import FieldsProject from './forms/fields-project';
import FieldsScreen from './forms/fields-screen';
import FormatProject from './forms/form-submission-project';
import FormatScreen from './forms/form-submission-screen';
import { objectEmpty } from '../../../helpers/helpers';
import { resetPost, submitPost } from '../../../state/post/actions';
import { setIndex } from '../../../state/set/index-actions';
import ValidateFieldProject from './forms/validate-field-project';
import ValidateFieldScreen from './forms/validate-field-screen';

const BlankState = {
  project: BlankStateProject,
  screen: BlankStateScreen,
};

const Fields = {
  project: FieldsProject,
  screen: FieldsScreen,
};

const FormSubmission = {
  project: FormatProject,
  screen: FormatScreen,
};

const ValidateField = {
  project: ValidateFieldProject,
  screen: ValidateFieldScreen,
};

class CreateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      BlankState[this.props.active],
      {
        dialogBool: false,
        dialogText: null,
        dialogTitle: null,
        inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      },
    );
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    const { active, postState } = nextProps;
    const success = this.props.postState[active].isSubmitted &&
      !postState[active].isSubmitted &&
      !postState[active].didSubmitFail
    ;
    if (success) {
      this.props.setIndex(postState[active]._id, active);
      this.props.cancel();
    }
  }
  componentWillUnmount() {
    window.addEventListener('resize', this.resize);
  }
  cancelForm = () => {
    this.props.cancel();
    this.setState(BlankState[this.props.active]);
  }
  dialogClose = () => {
    this.setState({
      dialogBool: false,
      dialogText: null,
      dialogTitle: null,
    });
  }
  dialogOpen = (title, text) => {
    this.setState({
      dialogBool: true,
      dialogText: text,
      dialogTitle: title,
    });
  }
  inputChange = (field, value, other, type) => {
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const stateObject = Object.assign({}, this.state.formData);
    if (!other) {
      const validate = ValidateField[this.props.active][field] ?
        ValidateField[this.props.active][field](value) :
      {
        error: false,
        message: null,
      };
      stateObject[field] = value;
      errors[field] = validate.error ? validate.message : null;
    } else {
      const validate = ValidateField[this.props.active][`${type}_${field}`] ?
        ValidateField[this.props.active][`${type}_${field}`](value) :
      {
        error: false,
        message: null,
      };
      stateObject.other[field] = value;
      errors.other[field] = validate.error ? validate.message : null;
    }
    const warning = !objectEmpty(errors);
    if (field === 'type') {
      const newFields = {};
      const newErrors = {};
      Fields[this.props.active].other[value].forEach((otherField) => {
        newErrors[otherField.name] = otherField.defaultError;
        newFields[otherField.name] = otherField.defaultValue;
      });
      stateObject.other = newFields;
      errors.other = newErrors;
    }
    this.setState({
      errors,
      formData: stateObject,
      warning,
    });
  }
  resetForm = () => {
    this.props.reset(this.props.active);
    this.setState(BlankState[this.props.active]);
  }
  resize = () => {
    this.setState({
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
    });
  }
  submitForm = () => {
    let error = false;
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    Object.keys(this.state.formData).forEach((field) => {
      if (field === 'other') {
        Object.keys(this.state.formData[field]).forEach((otherField) => {
          const otherFieldName = `${this.state.formData.type}_${otherField}`;
          if (ValidateField[this.props.active].otherCheckFields.indexOf(otherFieldName) > -1) {
            const validation = ValidateField[this.props.active][otherFieldName](
              this.state.formData.other[otherField]);
            if (validation.error) {
              error = true;
              errors.other[otherField] = validation.message;
            }
          }
        });
      } else if (ValidateField[this.props.active].checkFields.indexOf(field) > -1) {
        const validation = ValidateField[this.props.active][field](this.state.formData[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      const submitObj = FormSubmission[this.props.active](
        this.state.formData,
        this.props,
        this.props.selected,
      );
      console.log(submitObj);
      // this.props.create(this.props.active, submitObj);
    }
  }
  render() {
    return (
      <CreateContent
        active={ this.props.active }
        cancelForm={ this.cancelForm }
        dialog={ {
          close: this.dialogClose,
          open: this.state.dialogBool,
          text: this.state.dialogText,
          title: this.state.dialogTitle,
        } }
        dialogOpen={ this.dialogOpen }
        errors={ this.state.errors }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputWidth={ this.state.inputWidth }
        postState={ this.props.postState }
        resetForm={ this.resetForm }
        submitForm={ this.submitForm }
        warning={ this.state.warning }
      />
    );
  }
}

CreateContentContainer.defaultProps = {
  postState: {
    didSubmitFail: false,
    _id: null,
    isSubmitted: false,
    message: null,
  },
};

CreateContentContainer.propTypes = {
  active: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  // create: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }),
  reset: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  setIndex: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (active, obj) => {
      dispatch(submitPost(active, obj));
    },
    reset: (active) => {
      dispatch(resetPost(active));
    },
    setIndex: (_id, active) => {
      dispatch(setIndex(active, _id));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    postState: state.post,
    selected: state.selected,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateContentContainer);

export default Details;
