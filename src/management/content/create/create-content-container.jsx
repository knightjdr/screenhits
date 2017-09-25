import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import BlankStateExperiment from './forms/blank-state-experiment';
import BlankStateProject from './forms/blank-state-project';
import BlankStateScreen from './forms/blank-state-screen';
import CreateContent from './create-content';
import FieldsExperiment from './forms/fields-experiment';
import FieldsProject from './forms/fields-project';
import FieldsScreen from './forms/fields-screen';
import FormatExperiment from './forms/form-submission-experiment';
import FormatProject from './forms/form-submission-project';
import FormatScreen from './forms/form-submission-screen';
import { objectEmpty } from '../../../helpers/helpers';
import { resetPost, submitPost } from '../../../state/post/actions';
import { setIndex } from '../../../state/set/index-actions';
import ValidateFieldExperiment from './forms/validate-field-experiment';
import ValidateFieldProject from './forms/validate-field-project';
import ValidateFieldScreen from './forms/validate-field-screen';

const BlankState = {
  experiment: BlankStateExperiment,
  project: BlankStateProject,
  screen: BlankStateScreen,
};

const Fields = {
  experiment: FieldsExperiment,
  project: FieldsProject,
  screen: FieldsScreen,
};

const FormSubmission = {
  experiment: FormatExperiment,
  project: FormatProject,
  screen: FormatScreen,
};

const ValidateField = {
  experiment: ValidateFieldExperiment,
  project: ValidateFieldProject,
  screen: ValidateFieldScreen,
};

class CreateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      BlankState[this.props.activeLevel],
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
    const { activeLevel, postState } = nextProps;
    const success = this.props.postState[activeLevel].isSubmitted &&
      !postState[activeLevel].isSubmitted &&
      !postState[activeLevel].didSubmitFail
    ;
    if (success) {
      this.props.setIndex(activeLevel, postState[activeLevel]._id);
      this.props.cancelMenuAction();
    }
  }
  componentWillUnmount() {
    window.addEventListener('resize', this.resize);
  }
  cancelForm = () => {
    this.props.cancelMenuAction();
    this.setState(BlankState[this.props.activeLevel]);
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
      const validate = ValidateField[this.props.activeLevel][field] ?
        ValidateField[this.props.activeLevel][field](value) :
      {
        error: false,
        message: null,
      };
      stateObject[field] = value;
      errors[field] = validate.error ? validate.message : null;
    } else {
      const validate = ValidateField[this.props.activeLevel][`${type}_${field}`] ?
        ValidateField[this.props.activeLevel][`${type}_${field}`](value) :
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
      Fields[this.props.activeLevel].other[value].forEach((otherField) => {
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
    this.props.reset(this.props.activeLevel);
    this.setState(BlankState[this.props.activeLevel]);
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
          if (ValidateField[this.props.activeLevel].otherCheckFields.indexOf(otherFieldName) > -1) {
            const validation = ValidateField[this.props.activeLevel][otherFieldName](
              this.state.formData.other[otherField]);
            if (validation.error) {
              error = true;
              errors.other[otherField] = validation.message;
            }
          }
        });
      } else if (ValidateField[this.props.activeLevel].checkFields.indexOf(field) > -1) {
        const validation = ValidateField[this.props.activeLevel][field](this.state.formData[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      const submitObj = FormSubmission[this.props.activeLevel](
        this.state.formData,
        this.props.user,
        this.props.selected,
      );
      this.props.create(this.props.activeLevel, submitObj);
    }
  }
  render() {
    return (
      <CreateContent
        activeLevel={ this.props.activeLevel }
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
  user: {
    email: null,
    lab: null,
    name: null,
  },
};

CreateContentContainer.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  cancelMenuAction: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
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
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj) => {
      dispatch(submitPost(activeLevel, obj));
    },
    reset: (activeLevel) => {
      dispatch(resetPost(activeLevel));
    },
    setIndex: (activeLevel, _id) => {
      dispatch(setIndex(activeLevel, _id));
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
