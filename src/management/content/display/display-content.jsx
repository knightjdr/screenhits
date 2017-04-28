import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import DisplayProject from 'root/management/content/display/display-project.jsx';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Format from 'root/management/content/display/format-edit.js';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { uppercaseFirst } from 'root/helpers/helpers.js';
import ValidateField from 'root/management/content/create/validate-fields.js';

import 'root/management/content/display/display-content.scss';

class DisplayContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: Format.blankError[this.props.active],
      messages: {
        didPutFail: false,
        isPut: false,
        message: null
      },
      originalItem: Object.assign({}, this.props.item),
      reset: 0,
      updateItem: Object.assign({}, this.props.item),
      warning: false
    }
  }
  componentWillReceiveProps(nextProps) {
    //update item when store updates
    this.setState({originalItem: nextProps.item});
    //update messages
    const index = !nextProps.put[this.props.active] ? -1 : nextProps.put[this.props.active].findIndex(obj => obj._id === this.props.selected);
    const messages = index > - 1 ?
      nextProps.put[this.props.active][index]
      :
      {
        didPutFail: false,
        isPut: false,
        message: null
      }
    ;
    const success = this.state.messages.isPut && !messages.isPut && !messages.didPutFail ? true : false;
    if(success) {
      this.props.cancel();
    }
    this.setState({messages: messages});
  }
  cancel = () => {
    this.props.reset(this.props.item._id);
    this.props.cancel();
  }
  reset = () => {
    this.setState((prevState) => {
      return {
        errors: Format.blankError[this.props.active],
        reset: prevState.reset + 1,
        updateItem: prevState.originalItem,
        warning: false
      }
    });
  }
  update = () => {
    let error = false;
    let errors = {};
    for(let field in this.state.updateItem) {
      if(ValidateField[this.props.active].checkFields.indexOf(field) > -1) {
        const validation = ValidateField[this.props.active][field](this.state.updateItem[field]);
        if(validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    }
    if(error) {
      this.setState({errors: errors, warning: true});
    } else {
      this.props.update(this.props.item._id, this.state.updateItem);
    }
  }
  updateErrors = (errorObject, warning) => {
    this.setState({errors: errorObject, warning: warning});
  }
  updateItem = (updateObject) => {
    this.setState({updateItem: updateObject});
  }
  render () {
    return (
      <div className="display-container">
        {this.props.active === 'project' ?
          <DisplayProject edit={this.props.edit} errors={this.state.errors} item={this.state.originalItem} key={this.state.reset} updateErrors={this.updateErrors} updateItem={this.updateItem} />
        : null
        }
        {this.state.warning &&
          <div className="display-warning">
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        {this.props.edit &&
          <div className="display-buttons">
            <FlatButton
              className="display-button-update"
              data-tip
              data-for='updateData'
              label="Update"
              onClick={this.update}
            />
            <ReactTooltip id='updateData' effect='solid' type='dark' place="top">
              <span>Submit updates</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-reset"
              data-tip
              data-for='resetData'
              label="Reset"
              onClick={this.reset}
            />
            <ReactTooltip id='resetData' effect='solid' type='dark' place="top">
              <span>Reset to orignal information</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-cancel"
              data-tip
              data-for='cancelData'
              label="Cancel"
              onClick={this.cancel}
            />
            <ReactTooltip id='cancelData' effect='solid' type='dark' place="top">
              <span>Cancel editting</span>
            </ReactTooltip>
          </div>
        }
        <div className="edit-submission">
          <CSSTransitionGroup
            transitionName="edit-message-text"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            { this.state.messages.isPut &&
              <div className="edit-information" key="edit-submit">
                <FontAwesome name="spinner" pulse={true} />
                {'\u00A0'}{uppercaseFirst(this.props.active)} edit submitted.
              </div>
            }
            { this.state.messages.didPutFail &&
              <div className="edit-information" key="edit-fail" style={{zIndex: 2}}>
                <FontAwesome name="exclamation-triangle" />
                {uppercaseFirst(this.props.active)} edit failed.{'\u00A0'}
                {this.state.messages.message}.
              </div>
            }
            { this.state.messages.message && !this.state.messages.didPutFail &&
              <div className="edit-information" key="edit-message" style={{zIndex: 2}}>
                {this.state.messages.message}.
              </div>
            }
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
};

DisplayContent.propTypes = {
  reset: React.PropTypes.func.isRequired,
  put: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired
};

export default DisplayContent;
