import { objectEmpty } from 'root/helpers/helpers.js';
import React from 'react';
import TextField from 'material-ui/TextField';
import ValidateField from 'root/management/content/create/validate-fields.js';

class DisplayProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: Object.assign({}, this.props.item),
      warning: ''
    }
  }
  inputChange = (field, value) => {
    //check if field is valid and update errors object
    const errors = Object.assign({}, this.props.errors);
    const validate = ValidateField.project[field](value);
    errors[field] = validate.error ? validate.message : null;
    const warning = objectEmpty(errors) ? false : true;
    this.props.updateErrors(errors, warning);
    //update item state
    let updateObject = Object.assign({}, this.state.item);
    updateObject[field] = value;
    this.setState({item: updateObject});
    this.props.updateItem(updateObject);
  }
  render () {
    return (
      <div>
        {!this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Project name:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item.name}
            </div>
          </div>
          :
          <TextField
            errorText={this.props.errors.name}
            floatingLabelText="Project name (short)"
            fullWidth={true}
            multiLine={true}
            onChange={(e) => this.inputChange('name', e.target.value)}
            rows={1}
            rowsMax={2}
            value={this.state.item.name}
          />
        }
        {!this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Description:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item.description}
            </div>
          </div>
          :
          <TextField
            errorText={this.props.errors.description}
            floatingLabelText="Project description"
            fullWidth={true}
            multiLine={true}
            onChange={(e) => this.inputChange('description', e.target.value)}
            rows={1}
            rowsMax={2}
            value={this.state.item.description}
          />
        }
        {!this.props.edit &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Creator:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item['creator-name']}
            </div>
          </div>
        }
        {!this.props.edit &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span>
                Creation Date:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item['creation-date']}
            </div>
          </div>
        }
        {!this.props.edit && this.state.item && this.state.item['update-date'] &&
          <div className="display-element-container">
            <div className="display-element-key">
              <span className="">
                Details last updated:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item['update-date']}
            </div>
          </div>
        }
      </div>
    );
  }
};

DisplayProject.propTypes = {
};

export default DisplayProject;
