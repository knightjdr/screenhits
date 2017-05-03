import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import CreateContent from './create-content';
import Format from './format-submission';
import { objectEmpty } from '../../../helpers/helpers';
import { resetPost, submitPost } from '../../../state/post/actions';
import { setIndex } from '../../../state/set/index-actions';
import ValidateField from './validate-fields';

class CreateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = Format.blankState[this.props.active];
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
    this.setState(Format.blankState[this.props.active]);
  }
  inputChange = (field, value) => {
    // check if field is valid and update errors object
    const errors = Object.assign({}, this.state.errors);
    const validate = ValidateField.project[field](value);
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.setState({ errors, warning });
    // update item state
    const stateObject = Object.assign({}, this.state.formData);
    stateObject[field] = value;
    this.setState({ formData: stateObject });
  }
  resetForm = () => {
    this.props.reset(this.props.active);
    this.setState(Format.blankState[this.props.active]);
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
      const submitObj = Format[this.props.active](this.state.formData, this.props);
      this.props.create(this.props.active, submitObj);
    }
  }
  render() {
    return (
      <CreateContent
        active={ this.props.active }
        cancelForm={ this.cancelForm }
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

CreateContentContainer.propTypes = {
  active: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
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
