import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import FieldsExperiment from '../create/forms/fields-experiment';

const actionButtonStyle = {
  float: 'right',
  margin: '10px 10px 0px 0px',
};

const deleteContainer = {
  height: 40,
  width: '100%',
};

const Fields = {
  experiment: FieldsExperiment,
};

const elementContainerStyle = {
  alignItems: 'top',
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
  padding: '5px 5px 5px 5px',
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
  display: 'inline-flex',
  marginLeft: 4,
  marginRight: 4,
};

class DisplayExperiment extends React.Component {
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteExperiment(this.props.experiment._id); } }
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
                Name:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.experiment.name }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Experiment name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.experiment.name }
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
              { this.props.experiment.description }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Experiment description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.experiment.description }
          />
        }
        { !this.props.edit &&
          this.props.experiment.concentration ?
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
                  Concentration:
                </span>
              </div>
              <div
                style={ elementValueStyle }
              >
                { this.props.experiment.concentration }
              </div>
            </div>
            :
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
                onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ inputStyle }
                value={ this.props.experiment.concentration }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Concentration" field', Fields.experiment.concentration.help);
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
        }
        { !this.props.edit &&
          this.props.experiment.timepoint ?
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
                  Timepoint:
                </span>
              </div>
              <div
                style={ elementValueStyle }
              >
                { this.props.experiment.timepoint }
              </div>
            </div>
            :
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
                floatingLabelText="Timepoint (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ inputStyle }
                value={ this.props.experiment.timepoint }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Time point" field', Fields.experiment.timepoint.help);
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
        }
        { !this.props.edit &&
          this.props.experiment.protocols.length > 0 ?
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
                  Protocols:
                </span>
              </div>
              <div
                style={ elementValueStyle }
              >
                {
                  this.props.experiment.protocols.map((selectedProtocol) => {
                    const index = this.props.protocols.items.findIndex((protocol) => {
                      return protocol._id === selectedProtocol;
                    });
                    return index > 0 ?
                      this.props.protocols.items[index].name
                      :
                      `Protocol with id ${selectedProtocol} could not be found`
                    ;
                  }).join('<br />')
                }
              </div>
            </div>
            :
            <div />
        }
        { !this.props.edit ?
          this.props.experiment.comment &&
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
              { this.props.experiment.comment }
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
            value={ this.props.experiment.comment }
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
              { this.props.experiment.creatorName }
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
              { this.props.experiment.creationDate}
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
                  func: () => { this.props.dialog.open('delete'); },
                  label: 'Delete',
                  toolTipText: 'Delete experiment',
                } }
                idSuffix="delete-experiment"
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
          open={ this.props.dialog.delete }
          title="Confirmation"
        >
          This action will permanently delete the experiment (and all samples and
          analysis associated with it). Press confirm to proceed.
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

DisplayExperiment.propTypes = {
  deleteExperiment: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    delete: PropTypes.bool,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    cell: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  experiment: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
    concentration: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    protocols: PropTypes.arrayOf(
      PropTypes.number,
    ),
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  protocols: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayExperiment);
