import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import React from 'react';

import createStyle from './create-style';

class CreateProject extends React.Component {
  inputChangeComment = (e) => {
    this.props.inputChange('comment', e.target.value);
  }
  inputChangeDescription = (e) => {
    this.props.inputChange('description', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangePermission = (e, index, value) => {
    this.props.inputChange('permission', value);
  }
  render() {
    return (
      <div>
        <div>
          <FontAwesome name="info-circle" /> Name your project and provide a description.
        </div>
        <div
          style={ {
            display: 'flex',
            flexWrap: 'wrap',
          } }
        >
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Project name (short)"
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
            floatingLabelText="Project description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeDescription }
            rows={ 1 }
            rowsMax={ 5 }
            style={ createStyle.input }
            value={ this.props.formData.description }
          />
          <SelectField
            floatingLabelText="Other user permissions"
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ this.inputChangePermission }
            style={ createStyle.input }
            value={ this.props.formData.permission }
          >
            <MenuItem key="lr" value="lr" primaryText="Read - lab (all lab members can view this project)" />
            <MenuItem key="lw" value="lw" primaryText="Write - lab (all lab members can edit this project)" />
            <MenuItem key="ar" value="ar" primaryText="Read - all (all ScreenHits users can view this project)" />
            <MenuItem key="aw" value="aw" primaryText="Write - all (all ScreenHits users can edit this project)" />
            <MenuItem key="n" value="n" primaryText="None (only you can view this project)" />
          </SelectField>
          <TextField
            floatingLabelText="Comments"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeComment }
            rows={ 1 }
            rowsMax={ 5 }
            style={ createStyle.input }
            value={ this.props.formData.comment }
          />
        </div>
      </div>
    );
  }
}

CreateProject.propTypes = {
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
};

export default CreateProject;
