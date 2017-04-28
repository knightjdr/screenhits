import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import 'root/management/content/create/create-content.scss';

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div>
        <span className="create-header">
          <FontAwesome name="info-circle" /> Name your project and provide a description.
        </span>
        <TextField
          errorText={this.props.errors.name}
          floatingLabelText="Project name (short)"
          fullWidth={true}
          multiLine={true}
          onChange={(e) => this.props.inputChange('name', e.target.value)}
          rows={1}
          rowsMax={2}
          value={this.props.formData.name}
        />
        <TextField
          errorText={this.props.errors.description}
          floatingLabelText="Project description"
          fullWidth={true}
          multiLine={true}
          onChange={(e) => this.props.inputChange('description', e.target.value)}
          rows={1}
          rowsMax={4}
          value={this.props.formData.description}
        />
        <SelectField
          floatingLabelText="Other user permissions"
          fullWidth={true}
          value={this.props.formData.permission}
          onChange={(e, index, value) => this.props.inputChange('permission', value)}
        >
          <MenuItem key="lr" value="lr" primaryText="Read - lab (all lab members can view this project)" />
          <MenuItem key="lw" value="lw" primaryText="Write - lab (all lab members can edit this project)" />
          <MenuItem key="ar" value="ar" primaryText="Read - all (all ScreenHits users can view this project)" />
          <MenuItem key="aw" value="aw" primaryText="Write - all (all ScreenHits users can edit this project)" />
          <MenuItem key="n" value="n" primaryText="None (only you can view this project)" />
        </SelectField>
      </div>
    )
  }
}

export default CreateProject;
