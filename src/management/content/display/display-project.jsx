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
            onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
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
            onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
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
              <span className="">
                Owner:
              </span>
            </div>
            <div className="display-element-value">
              { this.props.item['owner-name'] }
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
      </div>
    );
  }
}

DisplayProject.propTypes = {
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
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
};

export default DisplayProject;
