import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import BlankState from '../../../../modules/blank-state';
import CreateContent from './create-content';
import DefaultProps from '../../../../types/default-props';
import Download from './download-datasource';
import Fields from '../../../../modules/fields';
import FormSubmission from '../../../../modules/form-submission';
import ValidateField from '../../../../modules/validate-field';
import { getData } from '../../../../state/get/data-actions';
import { objectEmpty } from '../../../../helpers/helpers';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { setIndex } from '../../../../state/set/index-actions';
import { userProp } from '../../../../types/index';

const timeout = {};

class CreateContentContainer extends React.Component {
  constructor(props) {
    super(props);
    const screenType = this.getScreenType(this.props.selected.screen, this.props.screens);
    this.state = Object.assign(
      {},
      this.getBlankState(this.props.activeLevel, screenType),
      {
        dialog: {
          help: false,
          text: null,
          title: null,
        },
        inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
        dataSource: {
          species: [],
        },
        screenType,
      },
    );
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const { activeLevel, postState, screens, selected } = nextProps;
    this.onCreate(activeLevel, postState, this.props.postState);
    this.updateScreenType(selected.screen, screens);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  onCreate = (activeLevel, nextPostState, currPostState) => {
    const success = currPostState[activeLevel].isSubmitted &&
      !currPostState[activeLevel].isSubmitted &&
      !currPostState[activeLevel].didSubmitFail
    ;
    if (
      success &&
      activeLevel !== 'sample'
    ) {
      this.props.setIndex(activeLevel, nextPostState[activeLevel]._id);
      this.props.cancelMenuAction();
    }
  }
  getBlankState = (activeLevel, screenType) => {
    if (activeLevel !== 'sample') {
      return BlankState[this.props.activeLevel];
    }
    return BlankState[this.props.activeLevel][screenType];
  }
  getScreenType = (screenID, screens) => {
    if (screenID) {
      const screenIndex = screens.findIndex((screen) => {
        return screen._id === screenID;
      });
      return screens[screenIndex].type;
    }
    return null;
  }
  cancelForm = () => {
    this.props.cancelMenuAction();
    this.setState(({ screenType }) => {
      return this.getBlankState(this.props.activeLevel, screenType);
    });
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
  downloadDataSource = (route, text) => {
    const getDataSource = () => {
      const queryString = `text=${text}`;
      Download(
        route,
        queryString,
        this.props.token
      )
        .then((data) => {
          this.setState(({ dataSource }) => {
            const newDataSource = {};
            newDataSource[route] = data;
            return {
              dataSource: Object.assign(
                {},
                dataSource,
                newDataSource,
              ),
            };
          });
        })
      ;
    };
    window.clearTimeout(timeout[route]);
    if (text) {
      timeout[route] = setTimeout(getDataSource, 400);
    }
  }
  inputChange = (field, value, other) => {
    this.setState(({ dataSource, errors, formData }) => {
      const newErrors = JSON.parse(JSON.stringify(errors));
      const newFormData = Object.assign({}, formData);
      if (!other) {
        if (
          typeof newFormData[field] === 'object' &&
          newFormData[field] &&
          newFormData[field].isArray
        ) {
          newFormData[field] = Object.assign([], value);
        } else if (
          field === 'species' &&
          dataSource.species.length > 0
        ) {
          newFormData[field] = value;
          const speciesIndex = dataSource.species.findIndex((entry) => {
            return entry.name === value;
          });
          if (speciesIndex > -1) {
            newFormData.taxonID = dataSource.species[speciesIndex]._id;
          }
        } else {
          newFormData[field] = value;
        }
        newErrors[field] = null;
      } else {
        newFormData.other[field] = value;
        newErrors.other[field] = null;
      }
      const warning = !objectEmpty(newErrors);
      if (field === 'type') {
        const newFields = {};
        const otherErrors = {};
        Fields[this.props.activeLevel].other[value].forEach((otherField) => {
          otherErrors[otherField.name] = otherField.defaultError;
          newFields[otherField.name] = otherField.defaultValue;
        });
        newFormData.other = newFields;
        newErrors.other = otherErrors;
      }
      return {
        errors: newErrors,
        formData: newFormData,
        warning,
      };
    });
  }
  resetForm = () => {
    this.props.reset(this.props.activeLevel);
    this.setState(({ screenType }) => {
      return this.getBlankState(this.props.activeLevel, screenType);
    });
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
  updateScreenType = (screenID, screens) => {
    const screenIndex = screens.findIndex((screen) => {
      return screen._id === screenID;
    });
    const nextType = screens[screenIndex].type;
    this.setState(({ screenType }) => {
      if (nextType !== screenType) {
        return {
          screenType: nextType,
        };
      }
      return {};
    });
  }
  render() {
    return (
      <CreateContent
        activeLevel={ this.props.activeLevel }
        cancelForm={ this.cancelForm }
        dataSource={ this.state.dataSource }
        dialog={ {
          close: this.dialogClose,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        downloadDataSource={ this.downloadDataSource }
        errors={ this.state.errors }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputWidth={ this.state.inputWidth }
        protocolGet={ this.props.protocolGet }
        protocols={ this.props.protocols }
        postState={ this.props.postState }
        resetForm={ this.resetForm }
        screenType={ this.state.screenType }
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
  screens: PropTypes.arrayOf(
    PropTypes.shape({
    }),
  ).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  setIndex: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj) => {
      dispatch(submitPost(activeLevel, obj, false));
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
    screens: state.available.screen.items,
    selected: state.selected,
    token: state.token,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateContentContainer);

export default Details;
