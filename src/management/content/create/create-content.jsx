import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import ActionButtons from '../../../action-buttons/action-buttons-container';
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
          <ActionButtons
            cancel={ {
              func: this.props.cancelForm,
              toolTipText: `Cancel ${this.props.active} creation`,
            } }
            idSuffix={ `create-${this.props.active}` }
            reset={ {
              func: this.props.resetForm,
              toolTipText: 'Reset the form',
            } }
            update={ {
              func: this.props.submitForm,
              label: 'Create',
            } }
          />
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
