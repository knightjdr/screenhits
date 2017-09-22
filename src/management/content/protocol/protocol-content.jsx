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

const iconStyle = {
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
  width: 500,
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
            { this.props.protocols.list.length > 0 ?
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
              { this.props.protocols.isGet &&
                <span>
                  <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching protocols...
                </span>
              }
              {
                this.props.protocols.list.length > 0 &&
                <SelectField
                  floatingLabelText="Existing protocols"
                  fullWidth={ true }
                  listStyle={ {
                    paddingBottom: 0,
                    paddingTop: 0,
                  } }
                  style={ inputStyle }
                  value={ this.props.selectedProtocol }
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
  changeNew: PropTypes.func.isRequired,
  createProtocol: PropTypes.func.isRequired,
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
      offWhite: PropTypes.string,
    }),
  }).isRequired,
  new: PropTypes.bool.isRequired,
  protocolName: PropTypes.string,
  protocols: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
  removeField: PropTypes.func.isRequired,
  selectedProtocol: PropTypes.number,
};

export default muiThemeable()(ProtocolContent);
