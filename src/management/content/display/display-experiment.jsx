import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
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
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';

import DisplayProtocol from './display-protocol';
import displayStyle from './display-style';
import Fields from '../../../modules/fields';
import { customSort } from '../../../helpers/helpers';

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
                { this.props.experiment.name }
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
                  Description:
                </span>
              </div>
              <div
                style={ displayStyle.elementValue }
              >
                { this.props.experiment.description }
              </div>
            </div>
            {
              this.props.experiment.concentration &&
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
                  { this.props.experiment.concentration }
                </div>
              </div>
            }
            {
              this.props.experiment.timepoint &&
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
                  { this.props.experiment.timepoint }
                </div>
              </div>
            }
            {
              this.props.experiment.comment &&
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
                  { this.props.experiment.comment }
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
                { this.props.experiment.creatorName }
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
                { this.props.experiment.creationDate}
              </div>
            </div>
            {
              this.props.experiment.protocols.length > 0 &&
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
                    Protocols:
                  </span>
                </div>
                <div
                  style={ displayStyle.elementValue }
                >
                  {
                    this.props.experiment.fullProtocols.map((protocol) => {
                      return (
                        <p
                          key={ `p-${protocol._id}` }
                          style={ {
                            margin: '0px 0px 5px 0px',
                          } }
                        >
                          &bull; { protocol.name }
                          <IconButton
                            key={ `button-${protocol._id}` }
                            onTouchTap={ () => {
                              this.props.selectProtocol(protocol);
                              this.props.dialog.open('protocol');
                            } }
                            iconStyle={ {
                              height: 18,
                              width: 18,
                            } }
                            style={ {
                              height: 22,
                              left: 10,
                              padding: '0px 0px 0px 0px',
                              position: 'relative',
                              top: 3,
                              width: 22,
                            } }
                            tooltip="View protocol"
                            tooltipPosition="top-center"
                          >
                            <VisibilityIcon
                              key={ `icon-${protocol._id}` }
                            />
                          </IconButton>
                        </p>
                      );
                    })
                  }
                </div>
              </div>
            }
            <div
              style={ displayStyle.deleteContainer }
            >
              <IconButton
                iconStyle={ {
                  color: this.props.muiTheme.palette.warning,
                } }
                onTouchTap={ () => { this.props.dialog.open('delete'); } }
                tooltip="Delete experiment"
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
              floatingLabelText="Experiment name (short)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              style={ displayStyle.input }
              value={ this.props.experiment.name }
            />
            <TextField
              errorText={ this.props.errors.description }
              floatingLabelText="Experiment description"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              style={ displayStyle.input }
              value={ this.props.experiment.description }
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
                floatingLabelText="Concentration (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.experiment.concentration }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Concentration" field', Fields.experiment.concentration.help);
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
                value={ this.props.experiment.timepoint }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Time point" field', Fields.experiment.timepoint.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
            </div>
            {
              this.props.protocols.isFetching ?
                <span
                  style={ displayStyle.input }
                >
                  <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching protocols...
                </span>
                :
                <div
                  style={ Object.assign(
                    {},
                    displayStyle.inputWithHelp,
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
                    multiple={ true }
                    onChange={ (e, index, value) => {
                      this.props.inputChange('protocols', value);
                    } }
                    style={ displayStyle.inputWithHelpSelect }
                    value={ this.props.experiment.protocols }
                  >
                    {
                      customSort.arrayOfObjectByKey(
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
                  <IconButton
                    onTouchTap={ () => {
                      this.props.dialog.open('help', 'Help for the "Protocols" field', Fields.experiment.protocols.help);
                    } }
                    tooltip="Help"
                    tooltipPosition="top-center"
                  >
                    <HelpIcon />
                  </IconButton>
                </div>
            }
            <TextField
              floatingLabelText="Comments (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
              rows={ 1 }
              rowsMax={ 5 }
              style={ displayStyle.input }
              value={ this.props.experiment.comment }
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
          This action will permanently delete the experiment and all samples
          associated with it. Press confirm to proceed.
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
        <Dialog
          actions={ this.dialogClose() }
          autoScrollBodyContent={ true }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.protocol }
          title={ this.props.selectedProtocol.name }
        >
          <DisplayProtocol
            protocol={ this.props.selectedProtocol }
          />
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
    protocol: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
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
    fullProtocols: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
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
        _id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  selectedProtocol: PropTypes.shape({
    name: PropTypes.string,
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
  selectProtocol: PropTypes.func.isRequired,
};

export default muiThemeable()(DisplayExperiment);
