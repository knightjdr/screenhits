import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import FieldsExperiment from './forms/fields-experiment';

const Fields = {
  experiment: FieldsExperiment,
};

const helpIconStyle = {
  marginTop: 25,
};

const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

const inputWithChildrenStyle = {
  display: 'flex',
  marginLeft: 4,
  marginRight: 4,
};

class CreateExperiment extends React.Component {
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
  inputChangeConcentration = (e) => {
    this.props.inputChange('concentration', e.target.value);
  }
  inputChangeDescription = (e) => {
    this.props.inputChange('description', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangeTimepoint = (e, index, value) => {
    this.props.inputChange('timepoint', value);
  }
  render() {
    return (
      <div>
        <div
          style={ {
            color: this.props.muiTheme.palette.alternateTextColor,
          } }
        >
          <FontAwesome name="info-circle" /> Name your experiment and provide all details below.
        </div>
        <div
          style={ {
            display: 'flex',
            flexWrap: 'wrap',
          } }
        >
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Experiment name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeName }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.formData.name }
          />
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Experiment description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeDescription }
            rows={ 1 }
            rowsMax={ 4 }
            style={ inputStyle }
            value={ this.props.formData.description }
          />
          <div
            style={ Object.assign(
              {},
              inputWithChildrenStyle,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Concentration (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeConcentration }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.concentration }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialogOpen('Help for the "Concentration" field', Fields.experiment.concentration.help);
              } }
              style={ helpIconStyle }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
            </IconButton>
          </div>
          <div
            style={ Object.assign(
              {},
              inputWithChildrenStyle,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Time point (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeTimepoint }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.timepoint }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialogOpen('Help for the "Time point" field', Fields.experiment.timepoint.help);
              } }
              style={ helpIconStyle }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
            </IconButton>
          </div>
          <div
            style={ Object.assign(
              {},
              inputWithChildrenStyle,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <SelectField
              floatingLabelText="Protocols"
              fullWidth={ true }
              listStyle={ {
                paddingBottom: 0,
                paddingTop: 0,
              } }
              style={ inputStyle }
              value={ this.props.formData.protocols }
            >
              { [].map((type) => {
                return (
                  <MenuItem
                    key={ type }
                    value={ type }
                    primaryText={ type }
                  />
                );
              }) }
            </SelectField>
            <IconButton
              onTouchTap={ () => {
                this.props.dialogOpen('Help for the "Protocols" field', Fields.experiment.protocols.help);
              } }
              style={ helpIconStyle }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
            </IconButton>
          </div>
        </div>
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.open }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
      </div>
    );
  }
}

CreateExperiment.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    open: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  dialogOpen: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    concentration: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    protocols: PropTypes.arr,
    timepoint: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(CreateExperiment);
