import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

class DisplayProject extends React.Component {
  render() {
    return (
      <div>
        { !this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Project name:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item.name }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Project name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ e => this.props.inputChange('name', e.target.value) }
            rows={ 1 }
            rowsMax={ 2 }
            value={ this.props.item.name }
          />
        }
        { !this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Description:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item.description }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Project description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ e => this.props.inputChange('description', e.target.value) }
            rows={ 1 }
            rowsMax={ 2 }
            value={ this.props.item.description }
          />
        }
        { !this.props.edit &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Creator:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item['creator-name'] }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span>
                Creation Date:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item['creation-date']}
            </div>
          </div>
        }
        { !this.props.edit && this.props.item && this.props.item['update-date'] &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Details last updated:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item['update-date'] }
            </div>
          </div>
        }
      </div>
    );
  }
}

DisplayProject.propTypes = {
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: null,
    name: null,
    permission: null,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
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
};

export default DisplayProject;
