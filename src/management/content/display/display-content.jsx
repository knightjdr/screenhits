import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import DisplayProject from './display-project-container';
import DisplayScreen from './display-screen-container';
import DisplayExperiment from './display-experiment-container';
import DisplaySample from './display-sample-container';
import Notice from '../../../messages/notice/notice';
import { uppercaseFirst } from '../../../helpers/helpers';

class DisplayContent extends React.Component {
  render() {
    return (
      <Paper
        style={ {
          maxHeight: 'calc(100vh - 130px)',
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
          autoHeightMax={ 'calc(100vh - 150px)' }
        >
          { this.props.activeLevel === 'project' ?
            <DisplayProject
              cancel={ this.props.cancel }
              delete={ this.props.delete }
              edit={ this.props.edit }
              errors={ this.props.errors }
              item={ this.props.item }
              key={ this.props.resetKey }
              updateErrors={ this.props.updateErrors }
              updateItem={ this.props.updateItem }
            />
              : null
          }
          { this.props.activeLevel === 'screen' ?
            <DisplayScreen
              cancel={ this.props.cancel }
              delete={ this.props.delete }
              edit={ this.props.edit }
              errors={ this.props.errors }
              inputWidth={ this.props.inputWidth }
              item={ this.props.item }
              key={ this.props.resetKey }
              updateErrors={ this.props.updateErrors }
              updateItem={ this.props.updateItem }
            />
              : null
          }
          { this.props.activeLevel === 'experiment' ?
            <DisplayExperiment
              cancel={ this.props.cancel }
              delete={ this.props.delete }
              edit={ this.props.edit }
              errors={ this.props.errors }
              inputWidth={ this.props.inputWidth }
              item={ this.props.item }
              key={ this.props.resetKey }
              updateErrors={ this.props.updateErrors }
              updateItem={ this.props.updateItem }
            />
              : null
          }
          { this.props.activeLevel === 'sample' ?
            <DisplaySample
              cancel={ this.props.cancel }
              delete={ this.props.delete }
              edit={ this.props.edit }
              errors={ this.props.errors }
              inputWidth={ this.props.inputWidth }
              item={ this.props.item }
              key={ this.props.resetKey }
              updateErrors={ this.props.updateErrors }
              updateItem={ this.props.updateItem }
            />
              : null
          }
          { this.props.warning &&
            <div
              style={ {
                color: this.props.muiTheme.palette.primary2Color,
                margin: '10px 0px 10px 0px',
              } }
            >
              <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
            </div>
          }
          { this.props.edit &&
            <div
              style={ {
                margin: '10px 0px 10px 0px',
              } }
            >
              <ActionButtons
                cancel={ {
                  func: this.props.cancel,
                  toolTipText: 'Cancel editting',
                } }
                idSuffix={ `display-${this.props.activeLevel}` }
                reset={ {
                  func: this.props.reset,
                  toolTipText: 'Reset to orignal information',
                } }
                update={ {
                  func: this.props.update,
                  toolTipText: 'Submit edits',
                } }
              />
            </div>
          }
          {
            this.props.editMessages &&
            this.props.editMessages._id &&
            this.props.editMessages._id === this.props.item._id &&
            <Notice
              fail={ this.props.editMessages.didPutFail }
              failMessage={ `${uppercaseFirst(this.props.activeLevel)} edit failed.
              ${this.props.editMessages.message}` }
              label="edit-notification"
              submit={ this.props.editMessages.isPut }
              submitMessage={ `${uppercaseFirst(this.props.activeLevel)} edit submitted` }
              succeed={ this.props.editMessages.message &&
                !this.props.editMessages.didPutFail }
              succeedMessage={ this.props.editMessages.message }
            />
          }
          {
            this.props.postMessage &&
            this.props.postMessage._id &&
            this.props.postMessage._id === this.props.item._id &&
            <Notice
              label="submit-notification"
              other={ this.props.postMessage.message }
              otherMessage={ this.props.postMessage.message }
            />
          }
          {
            this.props.deleteMessages &&
            this.props.deleteMessages._id &&
            this.props.deleteMessages._id === this.props.item._id &&
            <Notice
              fail={ this.props.deleteMessages.didDeleteFail }
              failMessage={ `${uppercaseFirst(this.props.activeLevel)} deletion failed.
              ${this.props.deleteMessages.message}` }
              label="delete-notification"
              submit={ this.props.deleteMessages.isDelete }
              submitMessage={ `${uppercaseFirst(this.props.activeLevel)} deletion requested` }
              succeed={ this.props.deleteMessages.message &&
                !this.props.deleteMessages.didDeleteFail }
              succeedMessage={ this.props.deleteMessages.message }
            />
          }
        </Scrollbars>
      </Paper>
    );
  }
}

DisplayContent.defaultProps = {
  postMessage: {
    _id: null,
    message: null,
  },
};

DisplayContent.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  deleteMessages: PropTypes.shape({
    didDeleteFail: PropTypes.bool,
    _id: PropTypes.number,
    isDelete: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  editMessages: PropTypes.shape({
    didPutFail: PropTypes.bool,
    _id: PropTypes.number,
    isPut: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({}).isRequired,
  inputWidth: PropTypes.number.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    ownerEmail: PropTypes.string,
    ownerName: PropTypes.string,
    permission: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary2Color: PropTypes.string,
    }),
  }).isRequired,
  postMessage: PropTypes.shape({
    _id: PropTypes.number,
    message: PropTypes.string,
  }),
  reset: PropTypes.func.isRequired,
  resetKey: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default muiThemeable()(DisplayContent);
