import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

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
            <FlatButton
              className="display-button-update"
              data-tip={ true }
              data-for="updateData"
              label="Update"
              onClick={ this.props.update }
            />
            <ReactTooltip id="updateData" effect="solid" type="dark" place="top">
              <span>Submit updates</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-reset"
              data-tip={ true }
              data-for="resetData"
              label="Reset"
              onClick={ this.props.reset }
            />
            <ReactTooltip id="resetData" effect="solid" type="dark" place="top">
              <span>Reset to orignal information</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-cancel"
              data-tip={ true }
              data-for="cancelData"
              label="Cancel"
              onClick={ this.props.cancel }
            />
            <ReactTooltip id="cancelData" effect="solid" type="dark" place="top">
              <span>Cancel editting</span>
            </ReactTooltip>
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

DisplayContent.propTypes = {
  active: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  editMessages: PropTypes.shape({
    didPutFail: false,
    _id: null,
    isPut: false,
    message: null,
  }).isRequired,
  errors: PropTypes.shape({
    description: null,
    name: null,
    permission: null,
  }).isRequired,
  item: PropTypes.shape({
    _id: 1,
    'creator-email': null,
    'creator-name': null,
    description: null,
    lab: null,
    name: null,
    'owner-email': null,
    'owner-name': null,
    permission: null,
    'creation-date': null,
    'update-date': null,
  }).isRequired,
  postMessage: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
  resetKey: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default DisplayContent;
