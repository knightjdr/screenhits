import CreateContent from 'root/management/content/create/create-content-container.js';
import DisplayContent from 'root/management/content/display/display-content-container.js';
import ManagementMenu from 'root/management/content/menu/management-menu.jsx';
import React from 'react';

import 'root/management/content/management-content.scss';

class ManagementContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createBoolean: false,
      editBoolean: false,
      item: {},
      manageBoolean: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.selected && nextProps.selected !== this.props.selected) {
      const index = nextProps.available[nextProps.active].items.findIndex(obj => obj._id === nextProps.selected);
      const item = nextProps.available[nextProps.active].items[index];
      this.setState({item: item});
      if(this.state.createBoolean) {
        this.setState({createBoolean: false});
      }
    }
  }
  cancel = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: false
    });
  }
  create = () => {
    this.setState({
      createBoolean: true,
      editBoolean: false,
      manageBoolean: false
    });
  }
  edit = () => {
    this.setState({
      createBoolean: false,
      editBoolean: true,
      manageBoolean: false
    });
  }
  manage = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: true
    });
  }
  render () {
    return (
      <div className="content-wrapper">
        <div className="content-menu">
          <ManagementMenu active={this.props.active} funcs={{create: this.create, edit: this.edit, manage: this.manage}} selected={this.props.selected} />
        </div>
        {this.state.createBoolean ?
          <CreateContent active={this.props.active} cancel={this.cancel} />
        : this.state.manageBoolean ?
          <ManageContent active={this.props.active} />
        : this.props.selected ?
          <DisplayContent active={this.props.active} cancel={this.cancel} edit={this.state.editBoolean} item={this.state.item} key={this.props.selected} selected={this.props.selected}/>
        : this.props.available[this.props.active].length === 0 ?
          <div className="content-intro">
            Create a new {this.props.active} to begin
          </div>
        :
          <div className="content-intro">
            Select an existing {this.props.active} or create a new {this.props.active} to begin
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
