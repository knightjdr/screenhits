import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircleIcon from 'material-ui/svg-icons/content/remove-circle';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { Scrollbars } from 'react-custom-scrollbars';

import ActionButtons from '../../../../action-buttons/action-buttons-container';
import Notice from '../../../../messages/notice/notice';
import { customSort } from '../../../../helpers/helpers';

const actionButtonStyle = {
  marginTop: 10,
};

const displayStyle = {
  margin: '10px 0px 0px 0px',
  padding: '5px 5px 5px 5px',
};

const elementContainerStyle = {
  alignItems: 'flex-stretch',
  display: 'flex',
  margin: '5px 0px 5px 0px',
};
const elementKeyStyle = {
  borderRadius: 2,
  textAlign: 'right',
  padding: '5px 5px 5px 5px',
  width: '20%',
  maxWidth: 150,
};
const elementValueStyle = {
  flex: 1,
  marginLeft: 10,
  padding: '5px 5px 5px 5px',
};

const iconStyle = {
  marginTop: 25,
};

const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

const inputFullWidthStyle = {
  width: '98%',
};

const inputWithHelpFullWidthStyle = {
  display: 'flex',
  width: '98%',
};

class ProtocolContent extends React.Component {
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteProtocol(this.props.selectedProtocol); } }
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
  inputChangeEditField = (e) => {
    this.props.inputChangeEdit(e.target.value);
  }
  inputChangeField = (e) => {
    this.props.inputChange('fieldName', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('protocolName', e.target.value);
  }
  inputChangeSubField = (index, value) => {
    this.props.inputChangeSubField(index, value);
  }
  templateButtonName = (selectedTemplate, templates) => {
    if (selectedTemplate) {
      const templateIndex = templates.findIndex((template) => {
        return template._id === selectedTemplate;
      });
      return (
        <span
          style={ {
            marginLeft: 10,
          } }
        >
          Selected: { templates[templateIndex].name }
        </span>
      );
    }
    return null;
  }
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
          renderThumbVertical={ ({ style, props }) => {
            return (
              <div
                { ...props }
                style={ Object.assign(
                  {},
                  style,
                  {
                    backgroundColor: this.props.muiTheme.palette.alternativeButtonColor,
                    borderRadius: 4,
                    opacity: 0.5,
                    width: 8,
                  }
                ) }
              />
            );
          } }
        >
          <div>
            { this.props.protocols.items.length > 0 ?
              <span>
                Edit an existing protocol by selecting it from the dropdown or create a new
                protocol using the &quot;<FontAwesome key="icon" name="plus-circle" /> Protocol&quot;
                button.
              </span>
              :
              <span>
                Create a new protocol using the
                &quot;<FontAwesome key="icon" name="plus-circle" /> Protocol&quot; button.
              </span>
            }
            <div
              style={ {
                display: 'flex',
                minHeight: 90,
              } }
            >
              { this.props.protocols.isFetching &&
                <span>
                  <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching protocols...
                </span>
              }
              {
                this.props.protocols.items.length > 0 &&
                <SelectField
                  floatingLabelText="Existing protocols"
                  fullWidth={ true }
                  listStyle={ {
                    paddingBottom: 0,
                    paddingTop: 0,
                  } }
                  onChange={ (e, index, value) => { this.props.protocolChange(value); } }
                  style={ inputStyle }
                  value={ this.props.selectedProtocol }
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
              <div
                style={ {
                  marginLeft: 'auto',
                  paddingTop: 27,
                } }
              >
                <FlatButton
                  backgroundColor={ this.props.muiTheme.palette.buttonColor }
                  hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                  label={ [<FontAwesome key="icon" name="plus-circle" />, ' Protocol'] }
                  labelStyle={ {
                    color: this.props.muiTheme.palette.offWhite,
                  } }
                  onTouchTap={ this.props.changeNew }
                />
                <ActionButtons
                  reset={ {
                    func: this.props.back,
                    label: 'Close',
                    toolTipText: 'Close view',
                  } }
                  idSuffix="delete-protocol"
                />
              </div>
            </div>
            { this.props.display &&
              this.props.protocols.items.length > 0 &&
              <div
                style={ displayStyle }
              >
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
                      Protocol name:
                    </span>
                  </div>
                  <div
                    style={ elementValueStyle }
                  >
                    { this.props.protocols.items[this.props.selectedProtocolIndex].name }
                  </div>
                </div>
                { this.props.protocols.items[this.props.selectedProtocolIndex]
                  .subSections.map((subsection) => {
                    return (
                      <div
                        key={ `protocolDisplay-container-${subsection.name}` }
                        style={ elementContainerStyle }
                      >
                        <div
                          key={ `protocolDisplay-keyContainer-${subsection.name}` }
                          style={ Object.assign(
                            {},
                            elementKeyStyle,
                            {
                              backgroundColor: this.props.muiTheme.palette.keyColor,
                              border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                            },
                          ) }
                        >
                          <span
                            key={ `protocolDisplay-key-${subsection.name}` }
                          >
                            { subsection.name }:
                          </span>
                        </div>
                        <div
                          key={ `protocolDisplay-value-${subsection.name}` }
                          style={ elementValueStyle }
                        >
                          { subsection.content }
                        </div>
                      </div>
                    );
                  })
                }
                <div
                  style={ actionButtonStyle }
                >
                  <FlatButton
                    backgroundColor={ this.props.muiTheme.palette.buttonColor }
                    hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                    label={ [<FontAwesome key="icon" name="pencil-square-o" />, ' Edit'] }
                    labelStyle={ {
                      color: this.props.muiTheme.palette.offWhite,
                    } }
                    onTouchTap={ this.props.changeEdit }
                  />
                  <ActionButtons
                    cancel={ {
                      func: this.props.dialog.open,
                      label: 'Delete',
                      toolTipText: 'Delete protocol',
                    } }
                    idSuffix="delete-protocol"
                  />
                </div>
                <Notice
                  label="display-notification"
                  succeed={ this.props.postState.message &&
                    !this.props.postState.didSubmitFail
                  }
                  succeedMessage={ this.props.postState.message }
                />
                <Notice
                  fail={ this.props.editMessages.didPutFail }
                  failMessage={ `Protocol edit failed. ${this.props.editMessages.message}` }
                  label="edit-notification"
                  submit={ this.props.editMessages.isPut }
                  submitMessage={ 'Protocol edit submitted' }
                  succeed={ this.props.editMessages.message &&
                    !this.props.editMessages.didPutFail }
                  succeedMessage={ this.props.editMessages.message }
                />
              </div>
            }
            { this.props.edit &&
              <div>
                <TextField
                  errorText={ this.props.errors.protocolName }
                  floatingLabelText="Protocol name"
                  fullWidth={ true }
                  multiLine={ true }
                  onChange={ (e) => { this.props.editChangeField('name', e.target.value); } }
                  rows={ 1 }
                  rowsMax={ 2 }
                  style={ inputFullWidthStyle }
                  value={ this.props.editProtocol.name }
                />
                {
                  this.props.editProtocol.subSections.map((field, index) => {
                    return (
                      <div
                        key={ `container-${field.name}` }
                        style={ inputWithHelpFullWidthStyle }
                      >
                        <TextField
                          floatingLabelText={ field.name }
                          fullWidth={ true }
                          key={ `text-${field.name}` }
                          multiLine={ true }
                          onChange={ (e) => {
                            this.props.editChangeField(field.name, e.target.value, index);
                          } }
                          rows={ 1 }
                          rowsMax={ 5 }
                          style={ inputFullWidthStyle }
                          value={ field.content }
                        />
                        <IconButton
                          key={ `icon-${field.name}` }
                          onTouchTap={ () => {
                            this.props.editRemoveField(index);
                          } }
                          style={ iconStyle }
                          tooltip="Remove field"
                          tooltipPosition="top-center"
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </div>
                    );
                  })
                }
                <div
                  style={ inputWithHelpFullWidthStyle }
                >
                  <TextField
                    errorText={ this.props.editFieldError }
                    onChange={ this.inputChangeEditField }
                    floatingLabelText="New subsection name"
                    fullWidth={ true }
                    value={ this.props.editFieldName }
                  />
                  <IconButton
                    onTouchTap={ () => {
                      this.props.addFieldEdit(this.props.editFieldName);
                    } }
                    style={ iconStyle }
                    tooltip="Add field"
                    tooltipPosition="top-center"
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
                <div
                  style={ actionButtonStyle }
                >
                  <ActionButtons
                    cancel={ {
                      func: this.props.cancelEdit,
                      toolTipText: 'Cancel editing',
                    } }
                    idSuffix="edit-protocol"
                    update={ {
                      func: this.props.updateProtocol,
                      label: 'Update',
                      toolTipText: 'Update protocol',
                    } }
                  />
                </div>
              </div>
            }
            { this.props.new &&
              <div
                style={ {
                  borderTop: `1px solid ${this.props.muiTheme.palette.blueGrey100}`,
                  marginTop: 20,
                  paddingTop: 10,
                } }
              >
                <div>
                  Create a new protocol using this form. Use the
                  <FontAwesome
                    name="plus-square"
                    style={ {
                      margin: '0px 5px 0px 5px',
                    } }
                  />
                  button to add new subsections to your protocol.
                  {
                    this.props.templates.items.length > 0 &&
                    <span
                      style={ {
                        marginLeft: 2,
                      } }
                    >
                      Alternatively, you can
                      import a protocol template by selecting it from the dropdown.
                    </span>
                  }
                </div>
                <div
                  style={ {
                    display: 'flex',
                    flexWrap: 'wrap',
                  } }
                >
                  {
                    this.props.templates.items.length > 0 &&
                    <span
                      style={ {
                        marginTop: 10,
                      } }
                    >
                      <FlatButton
                        backgroundColor={ this.props.muiTheme.palette.buttonColor }
                        hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                        key="button"
                        label="Templates"
                        onTouchTap={ (e) => { this.props.openTemplatePopover(e.target); } }
                        secondary={ true }
                      />
                      <Popover
                        anchorEl={ this.props.anchorEl }
                        anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                        key="popover"
                        onRequestClose={ this.props.closeTemplatePopover }
                        open={ this.props.templatePopover }
                        targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                      >
                        <Menu
                          listStyle={ {
                            paddingBottom: 0,
                            paddingTop: 0,
                          } }
                        >
                          { customSort.arrayOfObjectByKey(
                              this.props.templates.items,
                              'name',
                              'asc',
                            ).map((template) => {
                              return (
                                <MenuItem
                                  key={ template._id }
                                  onClick={ () => {
                                    this.props.templateChange(template._id);
                                  } }
                                  value={ template._id }
                                  primaryText={ template.name }
                                />
                              );
                            })
                          }
                        </Menu>
                      </Popover>
                      {
                        this.templateButtonName(
                          this.props.selectedTemplate,
                          this.props.templates.items
                        )
                      }
                    </span>
                  }
                  <TextField
                    errorText={ this.props.errors.protocolName }
                    floatingLabelText="Protocol name"
                    fullWidth={ true }
                    multiLine={ true }
                    onChange={ this.inputChangeName }
                    rows={ 1 }
                    rowsMax={ 2 }
                    style={ inputFullWidthStyle }
                    value={ this.props.protocolName }
                  />
                  {
                    this.props.fields.map((field, index) => {
                      return (
                        <div
                          key={ `container-${field.name}` }
                          style={ inputWithHelpFullWidthStyle }
                        >
                          <TextField
                            floatingLabelText={ field.name }
                            fullWidth={ true }
                            key={ `text-${field.name}` }
                            multiLine={ true }
                            onChange={ (e) => { this.inputChangeSubField(index, e.target.value); } }
                            rows={ 1 }
                            rowsMax={ 5 }
                            style={ inputFullWidthStyle }
                            value={ field.content }
                          />
                          <IconButton
                            key={ `icon-${field.name}` }
                            onTouchTap={ () => {
                              this.props.removeField(index);
                            } }
                            style={ iconStyle }
                            tooltip="Remove field"
                            tooltipPosition="top-center"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </div>
                      );
                    })
                  }
                </div>
                <div
                  style={ inputWithHelpFullWidthStyle }
                >
                  <TextField
                    onChange={ this.inputChangeField }
                    floatingLabelText="New subsection name"
                    fullWidth={ true }
                    value={ this.props.fieldName }
                  />
                  <IconButton
                    onTouchTap={ () => {
                      this.props.addField(this.props.fieldName);
                    } }
                    style={ iconStyle }
                    tooltip="Add field"
                    tooltipPosition="top-center"
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
                { this.props.fieldError &&
                  <div
                    style={ {
                      margin: '10px 0px 10px 0px',
                    } }
                  >
                    <FontAwesome name="exclamation-triangle " /> { this.props.fieldError }.
                  </div>
                }
                <div
                  style={ {
                    marginTop: 10,
                  } }
                >
                  <ActionButtons
                    cancel={ {
                      func: this.props.cancel,
                      toolTipText: 'Cancel protocol creation',
                    } }
                    idSuffix="create-protocol"
                    update={ {
                      func: this.props.createProtocol,
                      label: 'Create',
                    } }
                  />
                </div>
                <Notice
                  fail={ this.props.postState.didSubmitFail }
                  failMessage={ `Protocol creation failed. ${this.props.postState.message}.` }
                  label="create-notification"
                  submit={ this.props.postState.isSubmitted }
                  submitMessage="Protocol submitted"
                  succeed={ this.props.postState.message &&
                    !this.props.postState.didSubmitFail
                  }
                  succeedMessage={ this.props.postState.message }
                />
                <Notice
                  fail={ this.props.deleteMessages.didDeleteFail }
                  failMessage={ `Protocol deletion failed.
                  ${this.props.deleteMessages.message}` }
                  label="delete-notification"
                  submit={ this.props.deleteMessages.isDelete }
                  submitMessage="Protocol deletion requested"
                  succeed={ this.props.deleteMessages.message &&
                    !this.props.deleteMessages.didDeleteFail }
                  succeedMessage={ this.props.deleteMessages.message }
                />
              </div>
            }
          </div>
        </Scrollbars>
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
          This action will permanently delete the protocol. Press confirm to proceed.
        </Dialog>
      </Paper>
    );
  }
}

ProtocolContent.defaultProps = {
  editFieldError: '',
  editFieldName: '',
  fieldError: '',
  fieldName: '',
  protocolName: '',
  selectedProtocol: null,
  selectedProtocolIndex: null,
  selectedTemplate: null,
};

ProtocolContent.propTypes = {
  addField: PropTypes.func.isRequired,
  addFieldEdit: PropTypes.func.isRequired,
  anchorEl: PropTypes.shape({}).isRequired,
  back: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  changeNew: PropTypes.func.isRequired,
  changeEdit: PropTypes.func.isRequired,
  closeTemplatePopover: PropTypes.func.isRequired,
  createProtocol: PropTypes.func.isRequired,
  deleteMessages: PropTypes.shape({
    _id: PropTypes.number,
    didDeleteFail: PropTypes.bool,
    message: PropTypes.string,
    isDelete: PropTypes.bool,
  }).isRequired,
  deleteProtocol: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    bool: PropTypes.bool,
    close: PropTypes.func,
    open: PropTypes.func,
  }).isRequired,
  display: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  editChangeField: PropTypes.func.isRequired,
  editFieldError: PropTypes.string,
  editFieldName: PropTypes.string,
  editMessages: PropTypes.shape({
    _id: PropTypes.number,
    didPutFail: PropTypes.bool,
    message: PropTypes.string,
    isPut: PropTypes.bool,
  }).isRequired,
  editProtocol: PropTypes.shape({
    name: PropTypes.string,
    subSections: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
  }).isRequired,
  editRemoveField: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    protocolName: PropTypes.string,
  }).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  fieldError: PropTypes.string,
  fieldName: PropTypes.string,
  inputChange: PropTypes.func.isRequired,
  inputChangeEdit: PropTypes.func.isRequired,
  inputChangeSubField: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      blueGrey100: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  new: PropTypes.bool.isRequired,
  openTemplatePopover: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  protocolChange: PropTypes.func.isRequired,
  protocolName: PropTypes.string,
  protocols: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  removeField: PropTypes.func.isRequired,
  selectedProtocol: PropTypes.number,
  selectedProtocolIndex: PropTypes.number,
  selectedTemplate: PropTypes.number,
  templateChange: PropTypes.func.isRequired,
  templatePopover: PropTypes.bool.isRequired,
  templates: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  updateProtocol: PropTypes.func.isRequired,
};

export default muiThemeable()(ProtocolContent);
