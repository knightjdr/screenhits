import DisplayProject from 'root/management/content/display/display-project.jsx';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { uppercaseFirst } from 'root/helpers/helpers.js';

import 'root/management/content/display/display-content.scss';

class DisplayContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {
        didPutFail: false,
        isPut: false,
        message: null
      },
      reset: 0,
      updateItem: JSON.parse(JSON.stringify(this.props.item))
    }
  }
  componentWillReceiveProps(nextProps) {
    const index = !nextProps.put[this.props.active] ? -1 : nextProps.put[this.props.active].findIndex(obj => obj._id === this.props.selected);
    if(index > -1) {
      this.setState({messages: nextProps.put[this.props.active][index]})
    } else {
      this.setState({messages: {
        didPutFail: false,
        isPut: false,
        message: null
      }});
    }
  }
  cancel = () => {
    this.props.reset(this.props.item._id);
    this.props.cancel();
  }
  reset = () => {
    this.setState((prevState) => {
      return {reset: prevState.reset + 1}
    });
  }
  update = () => {
    this.props.update(this.props.item._id, this.state.updateItem);
  }
  updateItemFunc = (updateObject) => {
    this.setState({updateItem: updateObject});
  }
  render () {
    return (
      <div className="display-container">
        {this.props.active === 'project' ?
          <DisplayProject edit={this.props.edit} item={this.props.item} key={this.state.reset} update={this.updateItemFunc} />
        : null
        }
        {this.props.edit &&
          <div className="display-buttons">
            <FlatButton
              className="display-button-update"
              data-tip
              data-for='updateData'
              label="Update"
              onClick={this.update}
            />
            <ReactTooltip id='updateData' effect='solid' type='dark' place="top">
              <span>Submit updates</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-reset"
              data-tip
              data-for='resetData'
              label="Reset"
              onClick={this.reset}
            />
            <ReactTooltip id='resetData' effect='solid' type='dark' place="top">
              <span>Reset to orignal information</span>
            </ReactTooltip>
            <FlatButton
              className="display-button-cancel"
              data-tip
              data-for='cancelData'
              label="Cancel"
              onClick={this.cancel}
            />
            <ReactTooltip id='cancelData' effect='solid' type='dark' place="top">
              <span>Cancel editting</span>
            </ReactTooltip>
            <div className="edit-submission">
              { this.state.messages.isPut &&
                <span>
                  <FontAwesome name="spinner" pulse={true} />
                  {'\u00A0'}{uppercaseFirst(this.props.active)} edit submitted.
                </span>
              }
              { this.state.messages.didPutFail &&
                <span>
                  <FontAwesome name="exclamation-triangle" />
                  {uppercaseFirst(this.props.active)} edit failed.{'\u00A0'}
                </span>
              }
              { this.state.messages.message &&
                <span>
                  {this.state.messages.message}.
                </span>
              }
            </div>
          </div>
        }
      </div>
    );
  }
};

DisplayContent.propTypes = {
  reset: React.PropTypes.func.isRequired,
  put: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired
};

export default DisplayContent;
