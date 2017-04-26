import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';

class ScreenMenu extends React.Component {
  render () {
    return (
      <Menu>
        <MenuItem
          key="edit"
          primaryText={[<FontAwesome key="edit" name="pencil-square-o" />, ' Edit screen']}
        />
        <MenuItem
          key="add"
          primaryText={[<FontAwesome key="add" name="plus" />, ' Add new screen']}
        />
      </Menu>
    );
  }
};

export default ScreenMenu;
