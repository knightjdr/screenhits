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

import createStyle from './create-style';
import Fields from '../modules/fields';
import { customSort } from '../../../helpers/helpers';

class CreateExperiment extends React.Component {
  componentWillMount = () => {
    this.props.protocolGet();
  }
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
  inputChangeConcentration = (e) => {
    this.props.inputChange('concentration', e.target.value);
  }
  inputChangeDescription = (e) => {
    this.props.inputChange('description', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangeProtocol = (e, index, value) => {
    this.props.inputChange('protocols', value);
  }
  inputChangeTimepoint = (e) => {
    this.props.inputChange('timepoint', e.target.value);
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
            style={ createStyle.input }
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
            style={ createStyle.input }
            value={ this.props.formData.description }
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
                this.props.dialog.open('Help for the "Concentration" field', Fields.experiment.concentration.help);
              } }
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
              createStyle.inputWithHelp,
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
                this.props.dialog.open('Help for the "Time point" field', Fields.experiment.timepoint.help);
              } }
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
              createStyle.inputWithHelp,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            { this.props.protocols.isFetching ?
              <span
                style={ createStyle.input }
              >
                <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching protocols...
              </span>
              :
              <SelectField
                floatingLabelText="Protocols"
                fullWidth={ true }
                listStyle={ {
                  paddingBottom: 0,
                  paddingTop: 0,
                } }
                multiple={ true }
                onChange={ this.inputChangeProtocol }
                style={ createStyle.inputWithHelpSelect }
                value={ this.props.formData.protocols }
              >
                { customSort.arrayOfObjectByKey(
                    this.props.protocols.items,
                    'name',
                    'asc',
                  ).map((protocol) => {
                    return (
                      <MenuItem
                        key={ protocol._id }
                        value={ protocol._id }
                        primaryText={ protocol.name }
                      />
                    );
                  })
                }
              </SelectField>
            }
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Protocols" field', Fields.experiment.protocols.help);
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

CreateExperiment.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
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
};

export default muiThemeable()(CreateExperiment);
