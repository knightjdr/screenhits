import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

const elementContainerStyle = {
  alignItems: 'center',
  display: 'flex',
  margin: '5px 0px 5px 0px',
};
const elementKeyStyle = {
  borderRadius: 2,
  minWidth: 120,
  textAlign: 'right',
  padding: '5px 5px 5px 5px',
  width: 120,
};
const elementValueStyle = {
  marginLeft: 10,
};
const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

class DisplayProject extends React.Component {
  render() {
    return (
      <div>
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Project name:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
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
            style={ inputStyle }
            value={ this.props.item.name }
          />
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Description:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
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
            rowsMax={ 5 }
            style={ inputStyle }
            value={ this.props.item.description }
          />
        }
        { !this.props.edit ?
          this.props.item.comment &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Comments:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.item.comment }
            </div>
          </div>
          :
          <TextField
            floatingLabelText="Comments (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
            rows={ 1 }
            rowsMax={ 5 }
            style={ inputStyle }
            value={ this.props.item.comment }
          />
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creator:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.item.creatorName }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Owner:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.item.ownerName }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creation Date:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.item.creationDate}
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
    comment: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    ownerEmail: PropTypes.string,
    ownerName: PropTypes.string,
    permission: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayProject);
