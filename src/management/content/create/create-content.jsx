import ErrorCheck from 'root/management/content/helpers/field-error-check.js';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import 'root/management/content/create/create-content.scss';

const blankState = {
  description: '',
  errorText: {
    description: '',
    name: ''
  },
  name: '',
  permission: 'lr',
  warning: false,
};

class CreateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = blankState;
  }
  resetForm = () => {
    this.props.reset();
    this.setState(blankState);
  }
  cancelForm = () => {
    this.props.cancel();
    this.setState(blankState);
  }
  inputChange = (e, type) => {
    if(this.state.errorText[type]) {
      const errorText = this.state.errorText;
      errorText[type] = '';
      const warning = ErrorCheck.notEmpty(errorText) ? false : true;
      this.setState({errorText: errorText, warning: warning});
    }
    let stateObject = {};
    stateObject[type] = e.target.value;
    this.setState(stateObject);
  }
  submitForm = () => {
    let error = false;
    let errorText = {};
    if(!this.state.name) {
      error = true;
      errorText.name = 'This field is required'
    }
    if(!this.state.description) {
      error = true;
      errorText.description = 'This field is required'
    }
    if(error) {
      this.setState({errorText: errorText, warning: true});
    } else {
      let submitObj = {};
      submitObj['creator-email'] = this.props.user.email;
      submitObj['creator-name'] = this.props.user.name;
      submitObj.description = this.state.description;
      submitObj.lab = this.props.user.lab ? this.props.user.lab : null;
      submitObj.name = this.state.name;
      submitObj['owner-email'] = this.props.user.email;
      submitObj['owner-name'] = this.props.user.name;
      submitObj.permission = this.state.permission;
      submitObj.target = 'project';
      this.props.create(submitObj);
    }
  }
  render () {
    return (
      <div className="create-container">
        <span className="create-header">
          <FontAwesome name="info-circle" /> Name your project and provide a description.
        </span>
        <TextField
          errorText={this.state.errorText.name}
          floatingLabelText="Project name (short)"
          fullWidth={true}
          multiLine={true}
          onChange={(e) => this.inputChange(e, 'name')}
          rows={1}
          rowsMax={2}
          value={this.state.name}
        />
        <TextField
          errorText={this.state.errorText.description}
          floatingLabelText="Project description"
          fullWidth={true}
          multiLine={true}
          onChange={(e) => this.inputChange(e, 'description')}
          rows={1}
          rowsMax={4}
          value={this.state.description}
        />
        <SelectField
          floatingLabelText="Permissions"
          fullWidth={true}
          value={this.state.permission}
          onChange={(e) => this.inputChange(e, 'permission')}
        >
          <MenuItem value="lr" primaryText="Read - lab (all lab members can view this project)" />
          <MenuItem value="lw" primaryText="Write - lab (all lab members can edit this project)" />
          <MenuItem value="ar" primaryText="Read - all (all ScreenHits users can view this project)" />
          <MenuItem value="aw" primaryText="Write - all (all ScreenHits users can edit this project)" />
        </SelectField>
        {this.state.warning &&
          <div className="create-warning">
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        <div className="create-buttons">
          <FlatButton
            className="create-button-create"
            label="Create"
            onClick={this.submitForm}
          />
          <FlatButton
            className="create-button-reset"
            data-tip
            data-for='resetForm'
            label="Reset"
            onClick={this.resetForm}
          />
          <ReactTooltip id='resetForm' effect='solid' type='dark' place="top">
            <span>Reset the form</span>
          </ReactTooltip>
          <FlatButton
            className="create-button-cancel"
            data-tip
            data-for='cancelForm'
            label="Cancel"
            onClick={this.cancelForm}
          />
          <ReactTooltip id='cancelForm' effect='solid' type='dark' place="top">
            <span>Cancel project creation</span>
          </ReactTooltip>
          <div className="create-submission">
            { this.props.post.project.isSubmitted &&
              <span>
                <FontAwesome name="spinner" pulse={true} /> Project submitted
              </span>
            }
            { this.props.post.project.didSubmitFail &&
              <span>
                <FontAwesome name="exclamation-triangle" /> Project creation failed.{'\u00A0'}
              </span>
            }
            { this.props.post.project.message &&
              <span>
                {this.props.post.project.message}.
              </span>
            }
          </div>
        </div>
      </div>
    );
  }
};

CreateContent.propTypes = {
  create: React.PropTypes.func.isRequired,
  post: React.PropTypes.object.isRequired,
  reset: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired
};

export default CreateContent;
