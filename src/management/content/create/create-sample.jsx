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
import TextField from 'material-ui/TextField';

import createStyle from './create-style';
import Fields from '../modules/fields';
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
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
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
          this.props.file.name &&
          <div
            style={ {
              color: this.props.muiTheme.palette.alternateTextColor,
            } }
          >
            <hr />
            <p>
              The following columns with be defined as indicated:
            </p>
            {
              this.props.file.header.map((column, index) => {
                return (
                  <div
                    key={ column.name }
                    style={ {
                      alignItems: 'flex-start',
                      display: 'flex',
                      height: 18,
                      margin: '4px 0px 4px 0px',
                    } }
                  >
                    <div>
                      { `${column.value}: ${column.name}` }
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
                        <RemoveCircleIcon
                          color={ this.props.muiTheme.palette.alternateTextColor }
                        />
                      </IconButton>
                    }
                  </div>
                );
              })
            }
            {
              !objectEmpty(this.props.file.parsing) &&
                <div>
                  <hr />
                  <p>
                    The following columns will be parsed as indicated in the
                    example to extract relevant values:
                  </p>
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

            }
            {
              !objectEmpty(this.props.file.unusedColumns) &&
              <div>
                <hr />
                <p
                  style={ {
                    marginBottom: 5,
                  } }
                >
                  Columns listed in the dropdown below will not be stored with this
                  sample. To save a column, select it from the dropdown and change
                  its name as needed. You can also define the type of information it
                  contains: metric (readout), abundance measure, score or metadata.
                </p>
                <div
                  style={ {
                    display: 'flex',
                    flexWrap: 'wrap',
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
                          'metric',
                          'abundance',
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
                      <AddBoxIcon
                        color={ this.props.muiTheme.palette.alternateTextColor }
                      />
                    </IconButton>
                  }
                </div>
              </div>
            }
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
      </div>
    );
  }
}

CreateSample.propTypes = {
  changeColumnToUse: PropTypes.func.isRequired,
  changeFileType: PropTypes.func.isRequired,
  columnToUse: PropTypes.shape({
    index: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
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
    error: PropTypes.string,
    header: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    name: PropTypes.string,
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
    fileType: PropTypes.string,
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
  removeFromHeader: PropTypes.func.isRequired,
  updateUnused: PropTypes.func.isRequired,
  // resetFileInput: PropTypes.func.isRequired,
};

export default muiThemeable()(CreateSample);
