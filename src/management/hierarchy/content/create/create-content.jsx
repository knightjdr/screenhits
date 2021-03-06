import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import ActionButtons from '../../../../action-buttons/action-buttons-container';
import CreateExperiment from './create-experiment';
import CreateMicroscopySample from './create-microscopy-sample-container';
import CreateProject from './create-project';
import CreateSample from './create-sample-container';
import CreateScreen from './create-screen';
import Notice from '../../../../messages/notice/notice';
import { uppercaseFirst } from '../../../../helpers/helpers';

class CreateContent extends React.Component {
  render() {
    return (
      <Paper
        style={ {
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'hidden',
          padding: '15px 15px 10px 15px',
        } }
        zDepth={ 2 }
      >
        <Scrollbars
          autoHide={ true }
          autoHideTimeout={ 1000 }
          autoHideDuration={ 200 }
          autoHeight={ true }
          autoHeightMax={ 'calc(100vh - 160px)' }
          renderThumbVertical={ ({ style, props }) => {
            return (
              <div
                { ...props }
                style={ Object.assign(
                  {},
                  style,
                  {
                    backgroundColor: this.props.muiTheme.palette.alternativeButtonColor,
                    borderRadius: 4,
                    opacity: 0.5,
                    width: 8,
                  }
                ) }
              />
            );
          } }
        >
          { this.props.activeLevel === 'project' &&
            <CreateProject
              errors={ this.props.errors }
              formData={ this.props.formData }
              inputChange={ this.props.inputChange }
            />
          }
          { this.props.activeLevel === 'screen' &&
            <CreateScreen
              dataSource={ this.props.dataSource }
              dialog={ this.props.dialog }
              downloadDataSource={ this.props.downloadDataSource }
              errors={ this.props.errors }
              formData={ this.props.formData }
              inputChange={ this.props.inputChange }
              inputWidth={ this.props.inputWidth }
            />
          }
          { this.props.activeLevel === 'experiment' &&
            <CreateExperiment
              dialog={ this.props.dialog }
              errors={ this.props.errors }
              formData={ this.props.formData }
              inputChange={ this.props.inputChange }
              inputWidth={ this.props.inputWidth }
              protocolGet={ this.props.protocolGet }
              protocols={ this.props.protocols }
            />
          }
          {
            this.props.activeLevel === 'sample' &&
            this.props.screenType !== 'Microscopy' &&
            <CreateSample
              dialog={ this.props.dialog }
              cancel={ this.props.cancelForm }
              inputWidth={ this.props.inputWidth }
            />
          }
          {
            this.props.activeLevel === 'sample' &&
            this.props.screenType === 'Microscopy' &&
            <CreateMicroscopySample
              dialog={ this.props.dialog }
              cancel={ this.props.cancelForm }
              inputWidth={ this.props.inputWidth }
            />
          }
          { this.props.warning &&
            <div
              style={ {
                margin: '20px 0px 10px 0px',
              } }
            >
              <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
            </div>
          }
          <div
            style={ {
              marginTop: 10,
            } }
          >
            {
              this.props.activeLevel !== 'sample' &&
              <div
                style={ {
                  display: 'flex',
                } }
              >
                <ActionButtons
                  cancel={ {
                    func: this.props.cancelForm,
                    toolTipText: `Cancel ${this.props.activeLevel} creation`,
                  } }
                  idSuffix={ `create-${this.props.activeLevel}` }
                  reset={ {
                    func: this.props.resetForm,
                    toolTipText: 'Reset the form',
                  } }
                  update={ {
                    func: this.props.submitForm,
                    label: 'Create',
                  } }
                />
                <div
                  style={ {
                    flexGrow: 1,
                    margin: '10px 20px 0px 10px',
                    textAlign: 'left',
                  } }
                >
                  <Notice
                    fail={ this.props.postState[this.props.activeLevel].didSubmitFail }
                    failMessage={ `${uppercaseFirst(this.props.activeLevel)} creation failed.
                    ${this.props.postState[this.props.activeLevel].message}.` }
                    label="create-notification"
                    submit={ this.props.postState[this.props.activeLevel].isSubmitted }
                    submitMessage={ `${uppercaseFirst(this.props.activeLevel)} submitted` }
                    succeed={ this.props.postState[this.props.activeLevel].message &&
                      !this.props.postState[this.props.activeLevel].didSubmitFail
                    }
                    succeedMessage={ this.props.postState[this.props.activeLevel].message }
                  />
                </div>
              </div>
            }
          </div>
        </Scrollbars>
      </Paper>
    );
  }
}

CreateContent.defaultProps = {
  screenType: '',
};

CreateContent.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  cancelForm: PropTypes.func.isRequired,
  dataSource: PropTypes.shape({
    species: PropTypes.array,
  }).isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  downloadDataSource: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
    }),
  }).isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  protocolGet: PropTypes.func.isRequired,
  protocols: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    message: PropTypes.string,
  }).isRequired,
  resetForm: PropTypes.func.isRequired,
  screenType: PropTypes.string,
  submitForm: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default muiThemeable()(CreateContent);
