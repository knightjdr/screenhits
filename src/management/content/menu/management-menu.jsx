import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import React from 'react';

import 'root/management/content/menu/management-menu.scss';

class ManagementMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: null,
      showList: false
    };
  }
  create = () => {
    this.hideManagementList();
    this.props.funcs.create();
  }
  edit = () => {
    this.hideManagementList();
    this.props.funcs.edit();
  }
  hideManagementList = () => {
    this.setState({
      showList: false,
    });
  }
  manage = () => {
    this.hideManagementList();
    this.props.funcs.manage();
  }
  showManagementList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true
    });
  }
  render () {
    return (
      <span>
        <FloatingActionButton
          className="management-menu-button"
          mini={true}
          onClick={this.showManagementList}>
          <FontAwesome name="bars" />
        </FloatingActionButton>
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'center'}}
          animation={PopoverAnimationVertical}
          className="management-menu-popover"
          onRequestClose={this.hideManagementList}
          open={this.state.showList}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
          <Menu>
            {this.props.active === 'project' && this.props.selected &&
              <MenuItem
                key="manage"
                onClick={this.manage}
                primaryText={[<FontAwesome key="manage" name="user-plus" />, ' Manage ', this.props.active]}
              />
            }
            {this.props.selected &&
              <MenuItem
                key="edit"
                onClick={this.edit}
                primaryText={[<FontAwesome key="edit" name="pencil-square-o" />, ' Edit ', this.props.active]}
              />
            }
            <MenuItem
              key="add"
              onClick={this.create}
              primaryText={[<FontAwesome key="add" name="plus" />, ' Add new ', this.props.active]}
            />
          </Menu>
        </Popover>
      </span>
    );
  }
};

export default ManagementMenu;
