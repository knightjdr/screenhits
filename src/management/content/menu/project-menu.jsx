import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';

class ProjectMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  createProject = () => {
    this.props.hideList();
    this.props.funcs.create();
  }
  editProject = () => {
    this.props.hideList();
    this.props.funcs.edit();
  }
  manageProject = () => {
    this.props.hideList();
    this.props.funcs.manage();
  }
  render () {
    return (
      <Menu>
        {this.props.selected &&
          <MenuItem
            key="manage"
            onClick={this.manageProject}
            primaryText={[<FontAwesome key="manage" name="user-plus" />, ' Manage project']}
          />
        }
        {this.props.selected &&
          <MenuItem
            key="edit"
            onClick={this.editProject}
            primaryText={[<FontAwesome key="edit" name="pencil-square-o" />, ' Edit project']}
          />
        }
        <MenuItem
          key="add"
          onClick={this.createProject}
          primaryText={[<FontAwesome key="add" name="plus" />, ' Add new project']}
        />
      </Menu>
    );
  }
};

export default ProjectMenu;
