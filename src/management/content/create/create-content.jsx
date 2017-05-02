import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import CreateProject from './create-project';
import { uppercaseFirst } from '../../../helpers/helpers';

import './create-content.scss';

class CreateContent extends React.Component {
  render() {
    return (
      <div className="create-container">
        { this.props.active === 'project' ?
          <CreateProject
            errors={ this.props.errors }
            formData={ this.props.formData }
            inputChange={ this.props.inputChange }
          />
          : null
        }
        { this.props.warning &&
          <div className="create-warning">
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        <div className="create-buttons">
          <FlatButton
            className="create-button-create"
            label="Create"
            onClick={ this.props.submitForm }
          />
          <FlatButton
            className="create-button-reset"
            data-tip={ true }
            data-for="resetForm"
            label="Reset"
            onClick={ this.props.resetForm }
          />
          <ReactTooltip id="resetForm" effect="solid" type="dark" place="top">
            <span>Reset the form</span>
          </ReactTooltip>
          <FlatButton
            className="create-button-cancel"
            data-tip={ true }
            data-for="cancelForm"
            label="Cancel"
            onClick={ this.props.cancelForm }
          />
          <ReactTooltip id="cancelForm" effect="solid" type="dark" place="top">
            <span>Cancel { this.props.active } creation</span>
          </ReactTooltip>
          <div className="create-submission">
            <CSSTransitionGroup
              transitionName="create-message-text"
              transitionEnterTimeout={ 500 }
              transitionLeaveTimeout={ 500 }
            >
              { this.props.postState[this.props.active].isSubmitted &&
                <div className="create-information" key="create-submit">
                  <FontAwesome name="spinner" pulse={ true } /> { uppercaseFirst(this.props.active) } submitted
                </div>
              }
              { this.props.postState[this.props.active].didSubmitFail &&
                <div className="create-information" key="create-fail" style={ { zIndex: 2 } }>
                  <FontAwesome name="exclamation-triangle" /> { uppercaseFirst(this.props.active) } creation failed.{'\u00A0'}
                  { this.props.postState[this.props.active].message }.
                </div>
              }
              { this.props.postState[this.props.active].message &&
                !this.props.postState[this.props.active].didSubmitFail &&
                <div className="create-information" key="create-message" style={ { zIndex: 2 } }>
                  { this.props.postState[this.props.active].message }.
                </div>
              }
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

CreateContent.propTypes = {
  active: PropTypes.string.isRequired,
  cancelForm: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  resetForm: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default CreateContent;
