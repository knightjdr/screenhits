import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';

class ExperimentMenu extends React.Component {
  render () {
    return (
      <Menu>
        <MenuItem
          key="edit"
          primaryText={[<FontAwesome key="edit" name="file-text-o" />, ' Create new protocol']}
        />
        <MenuItem
          key="edit"
          primaryText={[<FontAwesome key="edit" name="pencil-square-o" />, ' Edit experiment']}
        />
        <MenuItem
          key="add"
          primaryText={[<FontAwesome key="add" name="plus" />, ' Add new experiment']}
        />
      </Menu>
    );
  }
};

export default ExperimentMenu;
