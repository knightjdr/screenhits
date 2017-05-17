import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import BlankStateProject from './forms/blank-state-project';
import BlankStateScreen from './forms/blank-state-screen';
import CreateContent from './create-content';
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
      },
    );
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
    const errors = Object.assign({}, this.state.errors);
    const validate = !other ?
      ValidateField[this.props.active][field](value) :
      ValidateField[this.props.active].other[type][field](value)
    ;
    const stateObject = Object.assign({}, this.state.formData);
    if (!other) {
      stateObject[field] = value;
      errors[field] = validate.error ? validate.message : null;
    } else {
      stateObject.other[field] = value;
      errors.other[field] = validate.error ? validate.message : null;
    }
    const warning = !objectEmpty(errors);
    console.log(errors, stateObject, warning);
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
  submitForm = () => {
    let error = false;
    const errors = {};
    Object.keys(this.state.formData).forEach((field) => {
      if (ValidateField[this.props.active].checkFields.indexOf(field) > -1) {
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
      const submitObj = FormSubmission[this.props.active](this.state.formData, this.props);
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
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateContentContainer);

export default Details;
