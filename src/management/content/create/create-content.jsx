import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import CreateProject from './create-project';
import CreateScreen from './create-screen';
import Notice from '../../../messages/notice/notice';
import { uppercaseFirst } from '../../../helpers/helpers';

class CreateContent extends React.Component {
  render() {
    return (
      <div
        style={ {
          padding: '15px 15px 10px 15px',
        } }
      >
        { this.props.active === 'project' ?
          <CreateProject
            errors={ this.props.errors }
            formData={ this.props.formData }
            inputChange={ this.props.inputChange }
          />
          : null
        }
        { this.props.active === 'screen' ?
          <CreateScreen
            errors={ this.props.errors }
            formData={ this.props.formData }
            inputChange={ this.props.inputChange }
          />
          : null
        }
        { this.props.warning &&
          <div
            style={ {
              color: this.props.muiTheme.palette.alternateTextColor,
              marginTop: 10,
            } }
          >
            <FontAwesome name="exclamation-triangle " /> There are errors in the form. Please correct before proceeding.
          </div>
        }
        <div
          style={ {
            marginTop: 15,
          } }
        >
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
          <div
            style={ {
              margin: '10px 0px 0px 10px',
            } }
          >
            <Notice
              fail={ this.props.postState[this.props.active].didSubmitFail }
              failMessage={ `${uppercaseFirst(this.props.active)} creation failed.
              ${this.props.postState[this.props.active].message}.` }
              label="create-notification"
              submit={ this.props.postState[this.props.active].isSubmitted }
              submitMessage={ `${uppercaseFirst(this.props.active)} submitted` }
              succeed={ this.props.postState[this.props.active].message &&
                !this.props.postState[this.props.active].didSubmitFail
              }
              succeedMessage={ this.props.postState[this.props.active].message }
            />
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
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
    }),
  }).isRequired,
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

export default muiThemeable()(CreateContent);
