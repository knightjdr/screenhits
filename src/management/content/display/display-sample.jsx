import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Description from 'material-ui/svg-icons/action/description';
import Dialog from 'material-ui/Dialog';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

import displayStyle from './display-style';
import Fields from '../modules/fields';

class DisplaySample extends React.Component {
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteSample(this.props.sample._id); } }
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
        { !this.props.edit &&
          <div>
            <div
              style={ displayStyle.elementContainer }
            >
              <div
                style={ Object.assign(
                  {},
                  displayStyle.elementKey,
                  {
                    backgroundColor: this.props.muiTheme.palette.keyColor,
                    border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                  },
                ) }
              >
                <span>
                  Name:
                </span>
              </div>
              <div
                style={ displayStyle.elementValue }
              >
                { this.props.sample.name }
              </div>
            </div>
            <div
              style={ displayStyle.elementContainer }
            >
              <div
                style={ Object.assign(
                  {},
                  displayStyle.elementKey,
                  {
                    backgroundColor: this.props.muiTheme.palette.keyColor,
                    border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                  },
                ) }
              >
                <span>
                  Replicate:
                </span>
              </div>
              <div
                style={ displayStyle.elementValue }
              >
                { this.props.sample.replicate }
              </div>
            </div>
            {
              this.props.sample.concentration &&
              <div
                style={ displayStyle.elementContainer }
              >
                <div
                  style={ Object.assign(
                    {},
                    displayStyle.elementKey,
                    {
                      backgroundColor: this.props.muiTheme.palette.keyColor,
                      border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                    },
                  ) }
                >
                  <span>
                    Concentration:
                  </span>
                </div>
                <div
                  style={ displayStyle.elementValue }
                >
                  { this.props.sample.concentration }
                </div>
              </div>
            }
            {
              this.props.sample.timepoint &&
              <div
                style={ displayStyle.elementContainer }
              >
                <div
                  style={ Object.assign(
                    {},
                    displayStyle.elementKey,
                    {
                      backgroundColor: this.props.muiTheme.palette.keyColor,
                      border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                    },
                  ) }
                >
                  <span>
                    Timepoint:
                  </span>
                </div>
                <div
                  style={ displayStyle.elementValue }
                >
                  { this.props.sample.timepoint }
                </div>
              </div>
            }
            {
              this.props.sample.comment &&
              <div
                style={ displayStyle.elementContainer }
              >
                <div
                  style={ Object.assign(
                    {},
                    displayStyle.elementKey,
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
                  style={ displayStyle.elementValue }
                >
                  { this.props.sample.comment }
                </div>
              </div>
            }
            <div
              style={ displayStyle.elementContainer }
            >
              <div
                style={ Object.assign(
                  {},
                  displayStyle.elementKey,
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
                style={ displayStyle.elementValue }
              >
                { this.props.sample.creatorName }
              </div>
            </div>
            <div
              style={ displayStyle.elementContainer }
            >
              <div
                style={ Object.assign(
                  {},
                  displayStyle.elementKey,
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
                style={ displayStyle.elementValue }
              >
                { this.props.sample.creationDate}
              </div>
            </div>
            <div
              style={ displayStyle.deleteContainer }
            >
              <IconButton
                onTouchTap={ this.props.viewSample }
                tooltip="View sample"
                tooltipPosition="bottom-left"
              >
                <Description />
              </IconButton>
              <IconButton
                onTouchTap={ this.props.downloadSample }
                tooltip="Download sample"
                tooltipPosition="bottom-left"
              >
                <FileDownload />
              </IconButton>
              <IconButton
                iconStyle={ {
                  color: this.props.muiTheme.palette.warning,
                } }
                onTouchTap={ () => { this.props.dialog.open('delete'); } }
                tooltip="Delete sample"
                tooltipPosition="bottom-left"
              >
                <DeleteForever />
              </IconButton>
            </div>
          </div>
        }
        { this.props.edit &&
          <div
            style={ displayStyle.container }
          >
            <TextField
              errorText={ this.props.errors.name }
              floatingLabelText="Sample name (short)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              style={ displayStyle.input }
              value={ this.props.sample.name }
            />
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                errorText={ this.props.errors.replicate }
                floatingLabelText="Replicate"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('replicate', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.replicate }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Replicate" field', Fields.sample.replicate.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Concentration (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.concentration }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Concentration" field', Fields.sample.concentration.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Timepoint (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.timepoint }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Time point" field', Fields.sample.timepoint.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
            </div>
            <TextField
              floatingLabelText="Comments (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
              rows={ 1 }
              rowsMax={ 5 }
              style={ displayStyle.input }
              value={ this.props.sample.comment }
            />
          </div>
        }
        <Dialog
          actions={ [
            this.confirmDeletion(),
            this.dialogClose(),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.delete }
          title="Confirmation"
        >
          This action will permanently delete the sample. Press confirm to proceed.
        </Dialog>
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.help }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
      </div>
    );
  }
}

DisplaySample.propTypes = {
  deleteSample: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    delete: PropTypes.bool,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  downloadSample: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  sample: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
    concentration: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  viewSample: PropTypes.func.isRequired,
};

export default muiThemeable()(DisplaySample);
