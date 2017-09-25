import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircleIcon from 'material-ui/svg-icons/content/remove-circle';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { Scrollbars } from 'react-custom-scrollbars';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import Notice from '../../../messages/notice/notice';

const actionButtonStyle = {
  marginTop: 10,
};

const displayStyle = {
  margin: '10px 0px 10px 0px',
  padding: '5px 5px 5px 5px',
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

const inputWithChildrenStyle = {
  display: 'flex',
  marginLeft: 4,
  marginRight: 4,
  width: 500,
};

const inputWithChildrenFullWidthStyle = {
  display: 'flex',
  width: '98%',
};

class ProtocolContent extends React.Component {
  inputChangeField = (e) => {
    this.props.inputChange('fieldName', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('protocolName', e.target.value);
  }
  inputChangeSubField = (index, value) => {
    this.props.inputChangeSubField(index, value);
  }
  render() {
    return (
      <Paper
        style={ {
          maxHeight: 'calc(100vh - 160px)',
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
          autoHeightMax={ 'calc(100vh - 185px)' }
        >
          <div
            style={ {
              color: this.props.muiTheme.palette.alternateTextColor,
              paddingBottom: 20,
            } }
          >
            { this.props.protocols.items.length > 0 ?
              `Edit an existing protocol by selecting it from the dropdown or create a new
              protocol using the "New" button.`
              :
              'Create a new protocol using the "New" button.'
            }
            <div
              style={ {
                display: 'flex',
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
                  { this.props.protocols.items.map((protocol) => {
                    return (
                      <MenuItem
                        key={ protocol._id }
                        value={ protocol._id }
                        primaryText={ protocol.name }
                      />
                    );
                  }) }
                </SelectField>
              }
              <div
                style={ {
                  marginLeft: 10,
                  paddingTop: 27,
                } }
              >
                <FlatButton
                  backgroundColor={ this.props.muiTheme.palette.buttonColor }
                  hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                  label={ [<FontAwesome key="icon" name="plus-circle" />, ' New'] }
                  labelStyle={ {
                    color: this.props.muiTheme.palette.offWhite,
                  } }
                  onTouchTap={ this.props.changeNew }
                />
              </div>
            </div>
            { this.props.display &&
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
                    { this.props.protocols.items[this.props.selectedProtocol].name }
                  </div>
                </div>
                { this.props.protocols.items[this.props.selectedProtocol]
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
                </div>
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
                        style={ inputWithChildrenFullWidthStyle }
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
                          <RemoveCircleIcon
                            color={ this.props.muiTheme.palette.alternateTextColor }
                          />
                        </IconButton>
                      </div>
                    );
                  })
                }
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
                </div>
                <div
                  style={ {
                    display: 'flex',
                    flexWrap: 'wrap',
                  } }
                >
                  <TextField
                    errorText={ this.props.errors.protocolName }
                    floatingLabelText="Protocol name"
                    fullWidth={ true }
                    multiLine={ true }
                    onChange={ this.inputChangeName }
                    rows={ 1 }
                    rowsMax={ 2 }
                    style={ inputStyle }
                    value={ this.props.protocolName }
                  />
                  {
                    this.props.fields.map((field, index) => {
                      return (
                        <div
                          key={ `container-${field.name}` }
                          style={ inputWithChildrenStyle }
                        >
                          <TextField
                            floatingLabelText={ field.name }
                            fullWidth={ true }
                            key={ `text-${field.name}` }
                            multiLine={ true }
                            onChange={ (e) => { this.inputChangeSubField(index, e.target.value); } }
                            rows={ 1 }
                            rowsMax={ 5 }
                            style={ inputStyle }
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
                            <RemoveCircleIcon
                              color={ this.props.muiTheme.palette.alternateTextColor }
                            />
                          </IconButton>
                        </div>
                      );
                    })
                  }
                </div>
                <div
                  style={ inputWithChildrenStyle }
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
                    <AddBoxIcon
                      color={ this.props.muiTheme.palette.alternateTextColor }
                    />
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
                  <div
                    style={ {
                      margin: '10px 0px 0px 10px',
                    } }
                  >
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
                  </div>
                </div>
              </div>
            }
          </div>
        </Scrollbars>
      </Paper>
    );
  }
}

ProtocolContent.defaultProps = {
  fieldError: '',
  fieldName: '',
  protocolName: '',
  selectedProtocol: null,
};

ProtocolContent.propTypes = {
  addField: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  changeNew: PropTypes.func.isRequired,
  changeEdit: PropTypes.func.isRequired,
  createProtocol: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  editChangeField: PropTypes.func.isRequired,
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
  inputChangeSubField: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      alternateTextColor2: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      blueGrey100: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
    }),
  }).isRequired,
  new: PropTypes.bool.isRequired,
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
  updateProtocol: PropTypes.func.isRequired,
};

export default muiThemeable()(ProtocolContent);
