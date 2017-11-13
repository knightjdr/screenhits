import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircleIcon from 'material-ui/svg-icons/content/remove-circle';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import createStyle from './create-style';
import Fields from '../../../modules/fields';
import { objectEmpty } from '../../../helpers/helpers';

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
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Replicate" field', Fields.sample.replicate.help);
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
              onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.concentration }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Concentration" field', Fields.sample.concentration.help);
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
              onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.timepoint }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Time point" field', Fields.sample.timepoint.help);
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
            style={ createStyle.input }
            value={ this.props.formData.comment }
          />
          <SelectField
            errorText={ this.props.errors.file }
            floatingLabelText="File type"
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ this.props.changeFileType }
            style={ createStyle.input }
            value={ this.props.formData.fileType }
          >
            {
              this.props.fileTypes.map((fileType) => {
                return (
                  <MenuItem
                    key={ fileType.name }
                    value={ fileType.type }
                    primaryText={ fileType.name }
                  />
                );
              })
            }
          </SelectField>
        </div>
        {
          this.props.formData.fileType &&
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
              label="File"
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
                {
                  this.props.file.error &&
                  <span>
                    { `, error: ${this.props.file.error}` }
                  </span>
                }
              </div>
            }
          </div>
        }
        {
          !this.props.file.name &&
          <div
            style={ {
              marginTop: 20,
            } }
          >
            <ActionButtons
              cancel={ {
                func: this.props.actions.cancel,
                label: this.props.cancelButton.label,
                toolTipText: this.props.cancelButton.tooltip,
              } }
              idSuffix="cancel-sample"
            />
          </div>

        }
        {
          this.props.file.name &&
          <div
            style={ createStyle.divFileParsed }
          >
            <hr />
            {
              this.props.file.header.length === 0 ?
                <div>
                  <FontAwesome name="exclamation-triangle " /> There are currently
                  no columns from the input file to be stored. Select columns using
                  the dropdown below.
                  </div>
                  :
                <div>
                  <div
                    style={ createStyle.userHeader }
                  >
                    <div
                      style={ Object.assign(
                        {},
                        createStyle.userHeaderKey,
                        {
                          backgroundColor: this.props.muiTheme.palette.keyColor,
                          border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                        },
                      ) }
                    >
                      Definitions:
                    </div>
                    <div
                      style={ createStyle.userHeaderContent }
                    >
                      The following columns with be defined as indicated.
                    </div>
                  </div>
                  {
                    this.props.file.header.map((column, index) => {
                      return (
                        <div
                          key={ column.name }
                          style={ {
                            alignItems: 'flex-start',
                            display: 'flex',
                            height: 18,
                            margin: '4px 0px 4px 150px',
                          } }
                        >
                          <div>
                            { `${column.value}: ${column.layName}` }
                            {
                              column.type &&
                              ` (${column.type})`
                            }
                          </div>
                          {
                            column.other &&
                            <IconButton
                              iconStyle={ createStyle.iconFontSmall }
                              onTouchTap={ () => { this.props.removeFromHeader(index); } }
                              style={ createStyle.iconSmall }
                              tooltip="Remove column"
                              tooltipPosition="top-center"
                            >
                              <RemoveCircleIcon />
                            </IconButton>
                          }
                        </div>
                      );
                    })
                  }
                </div>
            }
            {
              this.props.file.needMandatory &&
              <div>
                <hr />
                <div
                  style={ createStyle.userHeader }
                >
                  <div
                    style={ Object.assign(
                      {},
                      createStyle.userHeaderKey,
                      {
                        backgroundColor: this.props.muiTheme.palette.keyColor,
                        border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                      },
                    ) }
                  >
                    Required:
                  </div>
                  <div
                    style={ createStyle.userHeaderContent }
                  >
                    The following propeties have not been assigned to
                    columns in your file and are required. Select the appropiate column
                    from the dropdown.
                  </div>
                </div>
                {
                  this.props.file.mandatoryProperties.map((mandatoryProperty) => {
                    if (mandatoryProperty.matched === false) {
                      return (
                        <div
                          key={ `mandatoryContainer-${mandatoryProperty.name}` }
                          style={ {
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginLeft: 150,
                          } }
                        >
                          <div
                            key={ `mandatoryName-${mandatoryProperty.name}` }
                            style={ {
                              position: 'relative',
                              top: 42,
                            } }
                          >
                            { `${mandatoryProperty.layName} (${mandatoryProperty.type})` }
                          </div>
                          <SelectField
                            floatingLabelText="Unused columns"
                            fullWidth={ true }
                            key={ `mandatorySelected-${mandatoryProperty.name}` }
                            listStyle={ {
                              paddingBottom: 0,
                              paddingTop: 0,
                            } }
                            onChange={ (e, index, value) => {
                              this.props.defineMandatory(
                                mandatoryProperty.name,
                                value,
                              );
                            } }
                            style={
                              Object.assign(
                                {},
                                createStyle.inputSmall,
                                {
                                  marginLeft: 20,
                                }
                              )
                            }
                            value={ this.props.file.mandatory[mandatoryProperty.name] }
                          >
                            {
                              this.props.file.unusedColumns.map((column, index) => {
                                return (
                                  <MenuItem
                                    key={ `mandatoryMenu-${column.name}` }
                                    value={ index }
                                    primaryText={ column.name }
                                  />
                                );
                              })
                            }
                          </SelectField>
                          {
                            Object.keys(this.props.file.mandatory).length > 0 &&
                            <IconButton
                              onTouchTap={ this.props.addMandatory }
                              style={ createStyle.icon }
                              tooltip="Add column"
                              tooltipPosition="top-center"
                            >
                              <AddBoxIcon />
                            </IconButton>
                          }
                        </div>
                      );
                    }
                    return null;
                  })
                }
              </div>
            }
            {
              !objectEmpty(this.props.file.parsing) &&
                <div>
                  <hr />
                  <div
                    style={ createStyle.userHeader }
                  >
                    <div
                      style={ Object.assign(
                        {},
                        createStyle.userHeaderKey,
                        {
                          backgroundColor: this.props.muiTheme.palette.keyColor,
                          border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                        },
                      ) }
                    >
                      Parsing rules:
                    </div>
                    <div
                      style={ createStyle.userHeaderContent }
                    >
                      The following columns will be parsed as
                      indicated in the example to extract relevant values:
                    </div>
                  </div>
                  <div
                    style={ {
                      margin: '10px 0px 0px 150px',
                    } }
                  >
                    {
                      Object.keys(this.props.file.parsing).map((key) => {
                        return (
                          <div
                            key={ key }
                            style={ {
                              margin: '4px 0px 4px 0px',
                            } }
                          >
                            { `${key} - original value: ${this.props.file.parsing[key].original},
                            parsed value: ${this.props.file.parsing[key].parsed}` }
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

            }
            {
              !objectEmpty(this.props.file.unusedColumns) &&
              <div>
                <hr />
                <div
                  style={ createStyle.userHeader }
                >
                  <div
                    style={ Object.assign(
                      {},
                      createStyle.userHeaderKey,
                      {
                        backgroundColor: this.props.muiTheme.palette.keyColor,
                        border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                      },
                    ) }
                  >
                    Unused columns:
                  </div>
                  <div
                    style={ createStyle.userHeaderContent }
                  >
                    Columns listed in the dropdown below will not be stored with this
                    sample. To save a column, select it from the dropdown and change
                    its storage name as needed. You can also define the type of
                    information it contains: readout, metric (abundance, etc), score
                    or metadata.
                  </div>
                </div>
                <div
                  style={ {
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginLeft: 150,
                  } }
                >
                  <SelectField
                    floatingLabelText="Unused columns"
                    fullWidth={ true }
                    listStyle={ {
                      paddingBottom: 0,
                      paddingTop: 0,
                    } }
                    onChange={ (e, index, value) => {
                      this.props.changeColumnToUse(
                        'index',
                        value,
                        this.props.file.unusedColumns[index].name,
                      );
                    } }
                    style={ createStyle.inputSmall }
                    value={ this.props.columnToUse.index }
                  >
                    {
                      this.props.file.unusedColumns.map((column) => {
                        return (
                          <MenuItem
                            key={ column.index }
                            value={ column.index }
                            primaryText={ column.name }
                          />
                        );
                      })
                    }
                  </SelectField>
                  {
                    typeof this.props.columnToUse.index === 'number' &&
                    <TextField
                      errorText={ this.props.columnToUse.error }
                      floatingLabelText="Name"
                      fullWidth={ true }
                      onChange={ (e) => { this.props.changeColumnToUse('name', e.target.value); } }
                      style={ createStyle.input }
                      value={ this.props.columnToUse.name }
                    />
                  }
                  {
                    typeof this.props.columnToUse.index === 'number' &&
                    <SelectField
                      floatingLabelText="Column type"
                      fullWidth={ true }
                      listStyle={ {
                        paddingBottom: 0,
                        paddingTop: 0,
                      } }
                      onChange={ (e, index, value) => {
                        this.props.changeColumnToUse(
                          'type',
                          value,
                        );
                      } }
                      style={ createStyle.inputSmall }
                      value={ this.props.columnToUse.type }
                    >
                      {
                        [
                          'readout',
                          'metric',
                          'score',
                          'metadata',
                        ].map((type) => {
                          return (
                            <MenuItem
                              key={ type }
                              value={ type }
                              primaryText={ type }
                            />
                          );
                        })
                      }
                    </SelectField>
                  }
                  {
                    typeof this.props.columnToUse.index === 'number' &&
                    <IconButton
                      onTouchTap={ this.props.updateUnused }
                      style={ createStyle.icon }
                      tooltip="Add column"
                      tooltipPosition="top-center"
                    >
                      <AddBoxIcon />
                    </IconButton>
                  }
                </div>
              </div>
            }
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
          </div>
        }
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

CreateSample.propTypes = {
  actions: PropTypes.shape({
    cancel: PropTypes.func,
    reset: PropTypes.func,
    submit: PropTypes.func,
  }).isRequired,
  addMandatory: PropTypes.func.isRequired,
  cancelButton: PropTypes.shape({
    label: PropTypes.string,
    tooltip: PropTypes.string,
  }).isRequired,
  changeColumnToUse: PropTypes.func.isRequired,
  changeFileType: PropTypes.func.isRequired,
  columnToUse: PropTypes.shape({
    error: PropTypes.string,
    index: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  defineMandatory: PropTypes.func.isRequired,
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
  file: PropTypes.shape({
    error: PropTypes.string,
    header: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    mandatory: PropTypes.shape({}),
    mandatoryProperties: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    name: PropTypes.string,
    needMandatory: PropTypes.bool,
    parsing: PropTypes.shape({
      original: PropTypes.string,
      parsed: PropTypes.string,
    }),
    unusedColumns: PropTypes.arrayOf(
      PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  fileTypes: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
    concentration: PropTypes.string,
    fileType: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
  }).isRequired,
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
  readFileInput: PropTypes.func.isRequired,
  removeFromHeader: PropTypes.func.isRequired,
  snackbar: PropTypes.shape({
    close: PropTypes.func,
    duration: PropTypes.number,
    message: PropTypes.string,
    open: PropTypes.bool,
  }).isRequired,
  updateUnused: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default muiThemeable()(CreateSample);
