import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

import ActionButtons from '../../../action-buttons/action-buttons-container';

const actionButtonStyle = {
  float: 'right',
  margin: '10px 10px 0px 0px',
};

const deleteContainer = {
  height: 40,
  width: '100%',
};

const elementContainerStyle = {
  alignItems: 'center',
  display: 'flex',
  margin: '5px 0px 5px 0px',
};
const elementKeyStyle = {
  borderRadius: 2,
  minWidth: 120,
  textAlign: 'right',
  padding: '5px 5px 5px 5px',
  width: 120,
};
const elementValueStyle = {
  marginLeft: 10,
};
const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

class DisplayProject extends React.Component {
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteProject(this.props.project._id); } }
      />,
    ]);
  }
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
  render() {
    return (
      <div>
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Project name:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.name }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Project name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.project.name }
          />
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Description:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.description }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Project description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
            rows={ 1 }
            rowsMax={ 5 }
            style={ inputStyle }
            value={ this.props.project.description }
          />
        }
        { !this.props.edit ?
          this.props.project.comment &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Comments:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.comment }
            </div>
          </div>
          :
          <TextField
            floatingLabelText="Comments (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
            rows={ 1 }
            rowsMax={ 5 }
            style={ inputStyle }
            value={ this.props.project.comment }
          />
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creator:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.creatorName }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Owner:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.ownerName }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creation Date:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.project.creationDate}
            </div>
          </div>
        }
        {
          !this.props.edit &&
          <div
            style={ deleteContainer }
          >
            <div
              style={ actionButtonStyle }
            >
              <ActionButtons
                cancel={ {
                  func: this.props.dialog.open,
                  label: 'Delete',
                  toolTipText: 'Delete project',
                } }
                idSuffix="delete-project"
              />
            </div>
          </div>
        }
        <Dialog
          actions={ [
            this.confirmDeletion(),
            this.dialogClose(),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.bool }
          title="Confirmation"
        >
          This action will permanently delete the project (and all screens, experiments,
          samples and analysis associated with it). Press confirm to proceed.
        </Dialog>
      </div>
    );
  }
}

DisplayProject.propTypes = {
  deleteProject: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    bool: PropTypes.bool,
    close: PropTypes.func,
    open: PropTypes.func,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  project: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
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
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayProject);
