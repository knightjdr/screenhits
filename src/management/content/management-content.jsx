import React from 'react';
import ManagementMenu from 'root/management/content/menu/management-menu.jsx';

import 'root/management/content/management-content.scss';

class ManagementContent extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="content-wrapper">
        <div className="content-menu">
          <ManagementMenu active={this.props.active} selected={this.props.selected}/>
        </div>
        {this.props.available[this.props.active + 's'].length === 0 ?
          <div className="content-intro">
            Create a new {this.props.active} to begin

          </div>
        :
        !this.props.selected ?
          <div className="content-intro">
            Select an existing {this.props.active} or create a new {this.props.active} to begin
          </div>
        :
          <div>
          </div>
        }
      </div>
    );
  }
};

ManagementContent.propTypes = {
  available: React.PropTypes.object.isRequired
};

export default ManagementContent;
