import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import DisplayProject from './display-project-container';
import { uppercaseFirst } from '../../../helpers/helpers';

import './display-content.scss';

class DisplayContent extends React.Component {
  render() {
    return (
      <div className="display-container">
        {this.props.active === 'project' ?
          <DisplayProject
            edit={ this.props.edit }
            errors={ this.props.errors }
            item={ this.props.item }
            key={ this.props.resetKey }
            updateErrors={ this.props.updateErrors }
            updateItem={ this.props.updateItem }
          />
        : null
        }
        { this.props.warning &&
          <div className="display-warning">
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        { this.props.edit &&
          <div className="display-buttons">
            <ActionButtons
              cancel={ {
                func: this.props.cancel,
                toolTipText: 'Cancel editting',
              } }
              idSuffix={ `display-${this.props.active}` }
              reset={ {
                func: this.props.reset,
                toolTipText: 'Reset to orignal information',
              } }
              update={ {
                func: this.props.update,
                toolTipText: 'Submit edits',
              } }
            />
          </div>
        }
        <div className="edit-submission">
          <CSSTransitionGroup
            transitionName="edit-message-text"
            transitionEnterTimeout={ 500 }
            transitionLeaveTimeout={ 500 }
          >
            { this.props.editMessages &&
              this.props.editMessages.isPut &&
              <div className="edit-information" key="edit-submit">
                <FontAwesome name="spinner" pulse={ true } />
                {'\u00A0'}{ uppercaseFirst(this.props.active) } edit submitted.
              </div>
            }
            { this.props.editMessages &&
              this.props.editMessages.didPutFail &&
              <div className="edit-information" key="edit-fail" style={ { zIndex: 2 } }>
                <FontAwesome name="exclamation-triangle" />
                { uppercaseFirst(this.props.active) } edit failed.{'\u00A0'}
                { this.props.editMessages.message }.
              </div>
            }
            { this.props.editMessages &&
              this.props.editMessages.message &&
              !this.props.editMessages.didPutFail &&
              <div className="edit-information" key="edit-message" style={ { zIndex: 2 } }>
                { this.props.editMessages.message }.
              </div>
            }
            { this.props.postMessage &&
              <div className="edit-information" key="edit-message" style={ { zIndex: 2 } }>
                { this.props.postMessage }.
              </div>
            }
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

DisplayContent.defaultProps = {
  postMessage: null,
};

DisplayContent.propTypes = {
  active: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  editMessages: PropTypes.shape({
    didPutFail: PropTypes.bool,
    _id: PropTypes.number,
    isPut: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    'creator-email': PropTypes.string,
    'creator-name': PropTypes.string,
    description: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    'owner-email': PropTypes.string,
    'owner-name': PropTypes.string,
    permission: PropTypes.string,
    'creation-date': PropTypes.string,
    'update-date': PropTypes.string,
  }).isRequired,
  postMessage: PropTypes.string,
  reset: PropTypes.func.isRequired,
  resetKey: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default DisplayContent;
