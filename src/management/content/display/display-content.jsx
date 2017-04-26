import DisplayProject from 'root/management/content/display/display-project.jsx';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import 'root/management/content/display/display-content.scss';

class DisplayContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reset: 0
    }
  }
  cancel = () => {
    this.reset();
    this.props.cancel();
  }
  reset = () => {
    this.setState((prevState) => {
      return {reset: prevState.reset + 1}
    });
  }
  update = () => {

  }
  render () {
    return (
      <div className="display-container">
        {this.props.active === 'project' ?
          <DisplayProject edit={this.props.edit} item={this.props.item} key={this.state.reset}/>
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
          </div>
        }
      </div>
    );
  }
};

DisplayContent.propTypes = {
};

export default DisplayContent;
