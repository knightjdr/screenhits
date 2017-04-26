import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';

class SampleMenu extends React.Component {
  render () {
    return (
      <Menu>
        <MenuItem
          key="edit"
          primaryText={[<FontAwesome key="edit" name="pencil-square-o" />, ' Edit sample']}
        />
        <MenuItem
          key="add"
          primaryText={[<FontAwesome key="add" name="plus" />, ' Add new sample']}
        />
      </Menu>
    );
  }
};

export default SampleMenu;
