import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import React from 'react';

class ManagementMenu extends React.Component {
  render() {
    return (
      <span>
        <FloatingActionButton
          mini={ true }
          onClick={ this.props.showManagementList }
          iconStyle={ {
            color: this.props.muiTheme.palette.alternateTextColor2,
          } }
          style={ {
            zIndex: 5,
          } }
        >
          <FontAwesome name="bars" />
        </FloatingActionButton>
        <Popover
          anchorEl={ this.props.anchorEl }
          anchorOrigin={ { horizontal: 'middle', vertical: 'center' } }
          animation={ PopoverAnimationVertical }
          onRequestClose={ this.props.hideManagementList }
          open={ this.props.showList }
          targetOrigin={ { horizontal: 'left', vertical: 'bottom' } }
        >
          <Menu
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
          >
            { this.props.activeLevel === 'project' &&
              this.props.selected &&
              <MenuItem
                key="manage"
                onClick={ this.props.manageMenuAction }
                primaryText={ [<FontAwesome key="manage" name="user-plus" />, ' Manage ', this.props.activeLevel] }
              />
            }
            { this.props.selected &&
              <MenuItem
                key="edit"
                onClick={ this.props.editMenuAction }
                primaryText={ [<FontAwesome key="edit" name="pencil-square-o" />, ' Edit ', this.props.activeLevel] }
              />
            }
            <MenuItem
              key="add"
              onClick={ this.props.createMenuAction }
              primaryText={ [<FontAwesome key="add" name="plus" />, ' Add new ', this.props.activeLevel] }
            />
          </Menu>
        </Popover>
      </span>
    );
  }
}

ManagementMenu.defaultProps = {
  anchorEl: PropTypes.shape({}),
  selected: null,
};

ManagementMenu.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  anchorEl: PropTypes.shape({}),
  createMenuAction: PropTypes.func.isRequired,
  editMenuAction: PropTypes.func.isRequired,
  hideManagementList: PropTypes.func.isRequired,
  manageMenuAction: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor2: PropTypes.string,
    }),
  }).isRequired,
  selected: PropTypes.number,
  showList: PropTypes.bool.isRequired,
  showManagementList: PropTypes.func.isRequired,
};

export default muiThemeable()(ManagementMenu);
