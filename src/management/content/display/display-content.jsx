import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import DisplayProject from './display-project-container';
import Notice from '../../../messages/notice/notice';
import { uppercaseFirst } from '../../../helpers/helpers';

class DisplayContent extends React.Component {
  render() {
    return (
      <div
        style={ {
          padding: '15px 15px 10px 15px',
        } }
      >
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
          <div
            style={ {
              color: this.props.muiTheme.palette.primary2Color,
              marginTop: 10,
            } }
          >
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        { this.props.edit &&
          <div
            style={ {
              marginTop: 15,
            } }
          >
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
        <div
          style={ {
            margin: '10px 0px 0px 10px',
            position: 'relative',
          } }
        >
          <Notice
            fail={ this.props.editMessages.didPutFail }
            failMessage={ `${uppercaseFirst(this.props.active)} edit failed.
            ${this.props.editMessages.message}` }
            label="edit-notification"
            other={ this.props.postMessage }
            otherMessage={ this.props.postMessage }
            submit={ this.props.editMessages.isPut }
            submitMessage={ `${uppercaseFirst(this.props.active)} edit submitted` }
            succeed={ this.props.editMessages.message &&
            !this.props.editMessages.didPutFail }
            succeedMessage={ this.props.editMessages.message }
          />
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
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary2Color: PropTypes.string,
    }),
  }).isRequired,
  postMessage: PropTypes.string,
  reset: PropTypes.func.isRequired,
  resetKey: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
};

export default muiThemeable()(DisplayContent);
