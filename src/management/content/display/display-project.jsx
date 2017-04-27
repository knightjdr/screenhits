import ErrorCheck from 'root/management/content/helpers/field-error-check.js';
import React from 'react';
import TextField from 'material-ui/TextField';

class DisplayProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: {
        name: ''
      },
      item: JSON.parse(JSON.stringify(this.props.item)),
      warning: ''
    }
  }
  inputChange = (e, type) => {
    if(this.state.errorText[type]) {
      const errorText = this.state.errorText;
      errorText[type] = '';
      const warning = ErrorCheck.notEmpty(errorText) ? false : true;
      this.setState({errorText: errorText, warning: warning});
    }
    let updateObject = this.state.item;
    updateObject[type] = e.target.value;
    this.setState({item: updateObject});
    this.props.update(updateObject);
  }
  render () {
    return (
      <div>
        {!this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key-container">
              <span className="display-element-key">
                Project name:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item.name}
            </div>
          </div>
          :
          <TextField
            errorText={this.state.errorText.name}
            floatingLabelText="Project name (short)"
            fullWidth={true}
            multiLine={true}
            onChange={(e) => this.inputChange(e, 'name')}
            rows={1}
            rowsMax={2}
            value={this.state.item.name}
          />
        }
        {!this.props.edit ?
          <div className="display-element-container">
            <div className="display-element-key-container">
              <span className="display-element-key">
                Description:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item.description}
            </div>
          </div>
          :
          <TextField
            errorText={this.state.errorText.description}
            floatingLabelText="Project description"
            fullWidth={true}
            multiLine={true}
            onChange={(e) => this.inputChange(e, 'description')}
            rows={1}
            rowsMax={2}
            value={this.state.item.description}
          />
        }
        {!this.props.edit &&
          <div className="display-element-container">
            <div className="display-element-key-container">
              <span className="display-element-key">
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
            <div className="display-element-key-container">
              <span className="display-element-key">
                Creation Date:
              </span>
            </div>
            <div className="display-element-value">
              {this.state.item['creation-date']}
            </div>
          </div>
        }
        {!this.props.edit && this.state.item && this.state.item['creation-date'] &&
          <div className="display-element-container">
            <div className="display-element-key-container">
              <span className="display-element-key">
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
