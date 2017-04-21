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
  hideList = () => {
    this.setState({
      showList: false,
    });
  }
  showList = (event) => {
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
          onClick={this.showList}>
          <FontAwesome name="bars" />
        </FloatingActionButton>
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'center'}}
          animation={PopoverAnimationVertical}
          className="management-menu-popover"
          onRequestClose={this.hideList}
          open={this.state.showList}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
          <Menu>
            <MenuItem
              key="manage"
              primaryText={<FontAwesome name="user-plus" /> + ' Manage ' + this.props.active}
            />
            <MenuItem
              key="edit"
              primaryText={<FontAwesome name="pencil-square-o" /> + ' Edit ' + this.props.active}
            />
            <MenuItem
              key="add"
              primaryText={<FontAwesome name="plus" /> + ' Add new ' + this.props.active}
            />
          </Menu>
        </Popover>
      </span>
    );
  }
};

export default ManagementMenu;
