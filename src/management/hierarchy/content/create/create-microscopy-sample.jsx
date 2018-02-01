import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import ActionButtons from '../../../../action-buttons/action-buttons-container';
import createStyle from './create-style';
import Fields from '../../../../modules/fields';

class CreateMicroscopySample extends React.Component {
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
  helpIconButton = (title, text) => {
    return (
      <IconButton
        onTouchTap={ () => {
          this.props.dialog.open(
            `Help for the "${title}" field`,
            text
          );
        } }
        tooltip="Help"
        tooltipPosition="top-center"
      >
        <HelpIcon />
      </IconButton>
    );
  }
  render() {
    return (
      <div>
        <div>
          <FontAwesome name="info-circle" /> Name your sample, provide all
          details below and then select a file for upload.
        </div>
        <div
          style={ {
            display: 'flex',
            flexWrap: 'wrap',
          } }
        >
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Sample name"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
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
              errorText={ this.props.errors.replicate }
              floatingLabelText="Replicate"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('replicate', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.replicate }
            />
            { this.helpIconButton('Replicate', Fields.sample.replicate.help) }
          </div>
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
              floatingLabelText="Concentration"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.concentration }
            />
            { this.helpIconButton('Concentration', Fields.sample.concentration.help) }
          </div>
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
              floatingLabelText="Time point"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.timepoint }
            />
            { this.helpIconButton('Time point', Fields.sample.timepoint.help) }
          </div>
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
              floatingLabelText="Microscope"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('microscope', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.microscope }
            />
            { this.helpIconButton('Microscope', Fields.sample.microscope.help) }
          </div>
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
              floatingLabelText="Objective"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('objective', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.objective }
            />
            { this.helpIconButton('Objective', Fields.sample.objective.help) }
          </div>
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
              floatingLabelText="Digital zoom"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('digitalZoom', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.digitalZoom }
            />
            { this.helpIconButton('Digital zoom', Fields.sample.digitalZoom.help) }
          </div>
          <TextField
            floatingLabelText="Comments"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
            rows={ 1 }
            rowsMax={ 5 }
            style={ createStyle.input }
            value={ this.props.formData.comment }
          />
        </div>
        <div
          style={ {
            marginTop: 20,
          } }
        >
          Channels
          <div
            style={ {
              alignItems: 'center',
              display: 'flex',
              marginLeft: 10,
            } }
          >
            <div
              style={ {
                flexBasis: 50,
                flexGrow: 0,
                flexShrink: 0,
                marginRight: 15,
                marginTop: 25,
                textAlign: 'right',
              } }
            >
              Blue:
            </div>
            <TextField
              floatingLabelText="Wavelength"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('blue', 'wavelength', Number(e.target.value)); } }
              style={ createStyle.inputChannel }
              type="number"
              value={ this.props.formData.channels.blue.wavelength || '' }
            />
            <TextField
              floatingLabelText="Marker"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('blue', 'marker', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.blue.marker || '' }
            />
            <TextField
              floatingLabelText="Antibody"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('blue', 'antibody', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.blue.antibody || '' }
            />
            <TextField
              floatingLabelText="Dilution"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('blue', 'dilution', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.blue.dilution || '' }
            />
          </div>
          <div
            style={ {
              alignItems: 'center',
              display: 'flex',
              marginLeft: 10,
            } }
          >
            <div
              style={ {
                flexBasis: 50,
                flexGrow: 0,
                flexShrink: 0,
                marginRight: 15,
                marginTop: 25,
                textAlign: 'right',
              } }
            >
              Green:
            </div>
            <TextField
              floatingLabelText="Wavelength"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('green', 'wavelength', Number(e.target.value)); } }
              style={ createStyle.inputChannel }
              type="number"
              value={ this.props.formData.channels.green.wavelength || '' }
            />
            <TextField
              floatingLabelText="Marker"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('green', 'marker', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.green.marker || '' }
            />
            <TextField
              floatingLabelText="Antibody"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('green', 'antibody', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.green.antibody || '' }
            />
            <TextField
              floatingLabelText="Dilution"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('green', 'dilution', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.green.dilution || '' }
            />
          </div>
          <div
            style={ {
              alignItems: 'center',
              display: 'flex',
              marginLeft: 10,
            } }
          >
            <div
              style={ {
                flexBasis: 50,
                flexGrow: 0,
                flexShrink: 0,
                marginRight: 15,
                marginTop: 25,
                textAlign: 'right',
              } }
            >
              Red:
            </div>
            <TextField
              floatingLabelText="Wavelength"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('red', 'wavelength', Number(e.target.value)); } }
              style={ createStyle.inputChannel }
              type="number"
              value={ this.props.formData.channels.red.wavelength || '' }
            />
            <TextField
              floatingLabelText="Marker"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('red', 'marker', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.red.marker || '' }
            />
            <TextField
              floatingLabelText="Antibody"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('red', 'antibody', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.red.antibody || '' }
            />
            <TextField
              floatingLabelText="Dilution"
              fullWidth={ true }
              onChange={ (e) => { this.props.updateChannel('red', 'dilution', e.target.value); } }
              style={ createStyle.inputChannel }
              type="text"
              value={ this.props.formData.channels.red.dilution || '' }
            />
          </div>
        </div>
        <div
          style={ {
            display: 'flex',
            alignItems: 'flex-start',
            margin: '15px 0px 15px 0px',
          } }
        >
          <FlatButton
            backgroundColor={ this.props.muiTheme.palette.buttonColor }
            containerElement="label"
            hoverColor={ this.props.muiTheme.palette.buttonColorHover }
            label="File"
            labelStyle={ {
              color: this.props.muiTheme.palette.offWhite,
            } }
          >
            <input
              type="file"
              onChange={ this.props.readImage }
              style={ {
                display: 'none',
              } }
            />
          </FlatButton>
          {
            this.props.errors.file &&
            <div
              style={ {
                marginLeft: 10,
                marginTop: 10,
              } }
            >
              { `error: ${this.props.errors.file}` }
            </div>
          }
          {
            this.props.imgSrc &&
            !this.props.tiffWarning &&
            <img
              alt="Uploaded"
              src={ this.props.imgSrc }
              style={ {
                marginLeft: 10,
                maxHeight: 300,
                maxWidth: 300,
              } }
            />
          }
          {
            this.props.tiffWarning &&
            <div
              style={ {
                marginLeft: 10,
                marginTop: 10,
              } }
            >
              Image preview is not supported for .tif files
            </div>
          }
        </div>
        <div
          style={ {
            marginTop: 10,
          } }
        >
          { this.props.warning &&
            <div
              style={ {
                marginBottom: 10,
              } }
            >
              <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
            </div>
          }
          <div
            style={ {
              display: 'flex',
            } }
          >
            <ActionButtons
              cancel={ {
                func: this.props.actions.cancel,
                label: this.props.cancelButton.label,
                toolTipText: this.props.cancelButton.tooltip,
              } }
              idSuffix="create-sample"
              reset={ {
                func: this.props.actions.reset,
                toolTipText: 'Reset the form',
              } }
              update={ {
                func: this.props.actions.submit,
                label: 'Create',
              } }
            />
          </div>
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
        <Snackbar
          autoHideDuration={ this.props.snackbar.duration }
          message={ this.props.snackbar.message }
          open={ this.props.snackbar.open }
          onRequestClose={ this.props.snackbar.close }
        />
      </div>
    );
  }
}

CreateMicroscopySample.defaultProps = {
  imgSrc: null,
};

CreateMicroscopySample.propTypes = {
  actions: PropTypes.shape({
    cancel: PropTypes.func,
    reset: PropTypes.func,
    submit: PropTypes.func,
  }).isRequired,
  cancelButton: PropTypes.shape({
    label: PropTypes.string,
    tooltip: PropTypes.string,
  }).isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    file: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    channels: PropTypes.shape({
      blue: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
      green: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
      red: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
    }),
    comment: PropTypes.string,
    concentration: PropTypes.string,
    digitalZoom: PropTypes.string,
    microscope: PropTypes.string,
    name: PropTypes.string,
    objective: PropTypes.string,
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
  }).isRequired,
  imgSrc: PropTypes.string,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  readImage: PropTypes.func.isRequired,
  snackbar: PropTypes.shape({
    close: PropTypes.func,
    duration: PropTypes.number,
    message: PropTypes.string,
    open: PropTypes.bool,
  }).isRequired,
  tiffWarning: PropTypes.bool.isRequired,
  updateChannel: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default muiThemeable()(CreateMicroscopySample);
