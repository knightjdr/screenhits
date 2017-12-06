import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import BlankState from '../../../../modules/blank-state';
import CreateContent from './create-content';
import DefaultProps from '../../../../types/default-props';
import Fields from '../../../../modules/fields';
import FormSubmission from '../../../../modules/form-submission';
import ValidateField from '../../../../modules/validate-field';
import { getData } from '../../../../state/get/data-actions';
import { objectEmpty } from '../../../../helpers/helpers';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { setIndex } from '../../../../state/set/index-actions';
import { userProp } from '../../../../types/index';

class CreateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      BlankState[this.props.activeLevel],
      {
        dialog: {
          help: false,
          text: null,
          title: null,
        },
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
    if (
      success &&
      activeLevel !== 'sample'
    ) {
      this.props.setIndex(activeLevel, postState[activeLevel]._id);
      this.props.cancelMenuAction();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  cancelForm = () => {
    this.props.cancelMenuAction();
    this.setState(BlankState[this.props.activeLevel]);
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        help: false,
        text: null,
        title: null,
      },
    });
  }
  dialogOpen = (title, text) => {
    this.setState({
      dialog: {
        help: true,
        text,
        title,
      },
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
      if (
        typeof stateObject[field] === 'object' &&
        stateObject[field].isArray
      ) {
        stateObject[field] = Object.assign([], value);
      } else {
        stateObject[field] = value;
      }
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
      this.props.create(this.props.activeLevel, submitObj, this.props.user);
    }
  }
  render() {
    return (
      <CreateContent
        activeLevel={ this.props.activeLevel }
        cancelForm={ this.cancelForm }
        dialog={ {
          close: this.dialogClose,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        errors={ this.state.errors }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputWidth={ this.state.inputWidth }
        protocolGet={ this.props.protocolGet }
        protocols={ this.props.protocols }
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
  user: DefaultProps.user,
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
  protocolGet: PropTypes.func.isRequired,
  protocols: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  reset: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  setIndex: PropTypes.func.isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj, user) => {
      dispatch(submitPost(activeLevel, obj, false, user));
    },
    protocolGet: (user) => {
      dispatch(getData('protocol', {}, null, user));
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
    protocols: state.available.protocol,
    selected: state.selected,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateContentContainer);

export default Details;
