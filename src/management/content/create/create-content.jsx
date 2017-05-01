import CreateProject from 'root/management/content/create/create-project.jsx';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Format from 'root/management/content/create/format-submission.js';
import { objectEmpty, uppercaseFirst } from 'root/helpers/helpers.js';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ValidateField from 'root/management/content/create/validate-fields.js';

import 'root/management/content/create/create-content.scss';

class CreateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = Format.blankState[this.props.active];
  }
  componentWillReceiveProps(nextProps) {
    const success = this.props.post[this.props.active].isSubmitted && !nextProps.post[this.props.active].isSubmitted && !nextProps.post[this.props.active].didSubmitFail ? true : false;
    if(success) {
      this.props.setIndex(nextProps.post[this.props.active]._id, nextProps.active);
      this.props.cancel();
    }
  }
  cancelForm = () => {
    this.props.cancel();
    this.setState(Format.blankState[this.props.active]);
  }
  inputChange = (field, value) => {
    //check if field is valid and update errors object
    const errors = Object.assign({}, this.state.errors);
    const validate = ValidateField.project[field](value);
    errors[field] = validate.error ? validate.message : null;
    const warning = objectEmpty(errors) ? false : true;
    this.setState({errors: errors, warning: warning});
    //update item state
    let stateObject = Object.assign({}, this.state.formData);
    stateObject[field] = value;
    this.setState({formData: stateObject});
  }
  resetForm = () => {
    this.props.reset(this.props.active);
    this.setState(Format.blankState[this.props.active]);
  }
  submitForm = () => {
    let error = false;
    let errors = {};
    for(let field in this.state.formData) {
      if(ValidateField[this.props.active].checkFields.indexOf(field) > -1) {
        const validation = ValidateField[this.props.active][field](this.state.formData[field]);
        if(validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    }
    if(error) {
      this.setState({errors: errors, warning: true});
    } else {
      const submitObj = Format[this.props.active](this.state.formData, this.props);
      this.props.create(this.props.active, submitObj);
    }
  }
  render () {
    return (
      <div className="create-container">
        {this.props.active === 'project' ?
          <CreateProject errors={this.state.errors} formData={this.state.formData} inputChange={this.inputChange} />
          : null
        }
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
            <span>Cancel {this.props.active} creation</span>
          </ReactTooltip>
          <div className="create-submission">
            <CSSTransitionGroup
              transitionName="create-message-text"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              { this.props.post[this.props.active].isSubmitted &&
                <div className="create-information" key="create-submit">
                  <FontAwesome name="spinner" pulse={true} /> {uppercaseFirst(this.props.active)} submitted
                </div>
              }
              { this.props.post[this.props.active].didSubmitFail &&
                <div className="create-information" key="create-fail" style={{zIndex: 2}}>
                  <FontAwesome name="exclamation-triangle" /> {uppercaseFirst(this.props.active)} creation failed.{'\u00A0'}
                  {this.props.post[this.props.active].message}.
                </div>
              }
              { this.props.post[this.props.active].message && !this.props.post[this.props.active].didSubmitFail &&
                <div className="create-information" key="create-message" style={{zIndex: 2}}>
                  {this.props.post[this.props.active].message}.
                </div>
              }
            </CSSTransitionGroup>
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
  setIndex: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired
};

export default CreateContent;
