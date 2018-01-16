import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import BlankState from '../../../../modules/blank-state';
import CreateMicroscopySample from './create-microscopy-sample';
import DefaultProps from '../../../../types/default-props';
import FormSubmission from '../../../../modules/form-submission';
import ImageReader from '../../../../helpers/image-reader';
import ValidateField from '../../../../modules/validate-field';
import { objectEmpty } from '../../../../helpers/helpers';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { userProp } from '../../../../types/index';

const reset = {
  cancelButton: {
    label: 'Cancel',
    tooltio: 'Cancel sample creation',
  },
  snackbar: {
    duration: 3000,
    last: null,
    message: '',
    open: false,
  },
};

class CreateMicroscopySampleContainer extends React.Component {
  constructor(props) {
    super(props);
    const screenType = this.findScreen().type;
    this.state = {
      cancelButton: Object.assign({}, reset.cancelButton),
      didSubmit: false,
      formData: Object.assign({}, BlankState.sample.Microscopy.formData),
      errors: Object.assign({}, BlankState.sample.Microscopy.errors),
      imgSrc: null,
      screenType,
      snackbar: Object.assign({}, reset.snackbar),
      warning: BlankState.sample.Microscopy.warning,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { postState } = nextProps;
    // is an creation task has been submitted, update snackbar
    if (!deepEqual(postState, this.props.postState)) {
      this.updateSnackbar(postState, this.props.postState);
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { didSubmit, formData } = prevState;
    this.didFormUpdate(didSubmit, formData);
  }
  didFormUpdate = (didSubmit, prevFormData) => {
    if (
      didSubmit &&
      (
        this.state.formData.file.name !== prevFormData.file.name ||
        !deepEqual(this.state.formData, prevFormData)
      )
    ) {
      this.props.resetPost();
      this.setState({
        didSubmit: false,
        snackbar: Object.assign({}, reset.snackbar),
      });
    }
  }
  cancelForm = () => {
    this.resetForm();
    this.props.cancel();
  }
  findScreen = () => {
    const index = this.props.screens.findIndex((screen) => {
      return screen._id === this.props.selected.screen;
    });
    return this.props.screens[index];
  }
  inputChange = (field, value) => {
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const stateObject = Object.assign({}, this.state.formData);
    const validate = ValidateField.sample[field] ?
      ValidateField.sample[field](value)
      : {
        error: false,
        message: null,
      }
    ;
    if (
      typeof stateObject[field] === 'object' &&
      stateObject[field].isArray
    ) {
      stateObject[field] = Object.assign([], value);
    } else {
      stateObject[field] = value;
    }
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.setState({
      errors,
      formData: stateObject,
      warning,
    });
  }
  readImage = (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    ImageReader(file)
      .then((imageURL) => {
        if (imageURL) {
          this.setState(({ errors, formData }) => {
            return {
              formData: Object.assign(
                {},
                formData,
                {
                  file,
                }
              ),
              errors: Object.assign(
                {},
                errors,
                {
                  file: '',
                }
              ),
              imgSrc: imageURL[0],
            };
          });
        }
      })
      .catch((error) => {
        this.setState(({ errors, formData }) => {
          return {
            formData: Object.assign(
              {},
              formData,
              {
                file: { },
              }
            ),
            errors: Object.assign(
              {},
              errors,
              {
                file: error,
              }
            ),
            imgSrc: null,
          };
        });
      })
    ;
  }
  resetForm = () => {
    this.setState({
      cancelButton: Object.assign({}, reset.cancelButton),
      formData: Object.assign({}, BlankState.sample.Microscopy.formData),
      errors: Object.assign({}, BlankState.sample.Microscopy.errors),
      imgSrc: null,
      warning: BlankState.sample.Microscopy.warning,
    });
  }
  submitSample = () => {
    let error = false;
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    Object.keys(this.state.formData).forEach((field) => {
      if (ValidateField.sample.checkFields.indexOf(field) > -1) {
        const validation = ValidateField.sample[field](this.state.formData[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    // make sure file has been selected
    if (!this.state.formData.file.name) {
      error = true;
      errors.file = 'Please select a file for upload';
    }
    // if there are no errors, submit
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      const submitObj = FormSubmission.sample.Microscopy(
        this.state.formData,
        this.props.user,
        this.props.selected,
        this.state.screenType,
      );
      this.props.create('sample', submitObj, true);
      this.setState({
        cancelButton: {
          label: 'Close',
          tooltip: 'Close creation form',
        },
        didSubmit: true,
      });
    }
  }
  updateChannel = (channel, prop, value) => {
    this.setState(({ formData }) => {
      const newFormData = JSON.parse(JSON.stringify((formData)));
      newFormData.channels[channel][prop] = value;
      return {
        formData: newFormData,
      };
    });
  }
  updateSnackbar = (next, current) => {
    if (next.message) {
      const currentTime = new Date();
      const lastOpen = this.state.snackbar.last;
      const delay = !lastOpen || currentTime - lastOpen > 2000 ?
        0
        :
        2000 - (currentTime - lastOpen)
      ;
      const newSnackBarState = (orignalState, newValues) => {
        return {
          snackbar: Object.assign(
            {},
            orignalState,
            newValues,
            {
              last: currentTime,
            }
          ),
        };
      };
      setTimeout(() => {
        this.setState(({ snackbar }) => {
          if (next.isSubmitted) {
            return newSnackBarState(
              snackbar,
              {
                message: 'Task submitted',
                open: true,
              }
            );
          } else if (next.didSubmitFail) {
            return newSnackBarState(
              snackbar,
              {
                message: 'Submission failed',
                open: true,
              }
            );
          } else if (
            current.isSubmitted &&
            !next.isSubmitted
          ) {
            return newSnackBarState(
              snackbar,
              {
                message: 'Image uploaded',
                open: true,
              }
            );
          }
          return {};
        });
      }, delay);
    }
  }
  render() {
    return (
      <CreateMicroscopySample
        actions={ {
          cancel: this.cancelForm,
          reset: this.resetForm,
          submit: this.submitSample,
        } }
        cancelButton={ this.state.cancelButton }
        dialog={ this.props.dialog }
        errors={ this.state.errors }
        formData={ this.state.formData }
        imgSrc={ this.state.imgSrc }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        postState={ this.props.postState }
        readImage={ this.readImage }
        resetForm={ this.resetForm }
        snackbar={ this.state.snackbar }
        updateChannel={ this.updateChannel }
        warning={ this.state.warning }
      />
    );
  }
}

CreateMicroscopySampleContainer.defaultProps = {
  postState: {
    didSubmitFail: false,
    _id: null,
    isSubmitted: false,
    message: null,
  },
  user: DefaultProps.user,
};

CreateMicroscopySampleContainer.propTypes = {
  cancel: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }),
  resetPost: PropTypes.func.isRequired,
  screens: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj, isFormData) => {
      dispatch(submitPost(activeLevel, obj, isFormData));
    },
    resetPost: () => {
      dispatch(resetPost('sample'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    postState: state.post.sample,
    screens: state.available.screen.items,
    selected: state.selected,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateMicroscopySampleContainer);

export default Details;
