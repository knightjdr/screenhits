import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

import createStyle from './create-style';
import Fields from '../modules/fields';

class CreateSample extends React.Component {
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
      />,
    ]);
  }
  inputChangeComment = (e) => {
    this.props.inputChange('comment', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangeReplicate = (e) => {
    this.props.inputChange('replicate', e.target.value);
  }
  render() {
    return (
      <div>
        <div
          style={ {
            color: this.props.muiTheme.palette.alternateTextColor,
          } }
        >
          <FontAwesome name="info-circle" />
          Name your sample, provide all details below and then select a file for upload.
        </div>
        <div
          style={ {
            display: 'flex',
            flexWrap: 'wrap',
          } }
        >
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Screen name"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeName }
            rows={ 1 }
            rowsMax={ 2 }
            style={ createStyle.input }
            value={ this.props.formData.name }
          />
          <div
            style={ Object.assign(
              {},
              createStyle.inputWithHelp,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Replicate"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeReplicate }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.replicate }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Replicate" field', Fields.sample.replicate.help);
              } }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
            </IconButton>
          </div>
          <TextField
            floatingLabelText="Comments (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeComment }
            rows={ 1 }
            rowsMax={ 5 }
            style={ createStyle.input }
            value={ this.props.formData.comment }
          />
        </div>
        <div
          style={ {
            display: 'flex',
            alignItems: 'center',
            margin: '15px 0px 15px 0px',
          } }
        >
          <FlatButton
            backgroundColor={ this.props.muiTheme.palette.buttonColor }
            containerElement="label"
            hoverColor={ this.props.muiTheme.palette.buttonColorHover }
            label="Upload"
            labelStyle={ {
              color: this.props.muiTheme.palette.offWhite,
            } }
          >
            <input
              type="file"
              onChange={ this.props.readFileInput }
              style={ {
                display: 'none',
              } }
            />
          </FlatButton>
          {
            this.props.file.name &&
            <div
              style={ {
                marginLeft: 10,
              } }
            >
              File name: { this.props.file.name }
            </div>
          }
        </div>
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

CreateSample.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      offWhite: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  readFileInput: PropTypes.func.isRequired,
  // resetFileInput: PropTypes.func.isRequired,
};

export default muiThemeable()(CreateSample);
