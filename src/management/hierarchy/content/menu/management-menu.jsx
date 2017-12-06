import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import React from 'react';

const containerStyle = {
  bottom: 0,
  height: 50,
  left: 0,
  position: 'absolute',
  width: 50,
};
const fabStyle = {
  zIndex: 5,
};
const fontStyle = {
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
};

class ManagementMenu extends React.Component {
  render() {
    return (
      <div
        onMouseOut={ this.props.shrinkMenu }
        onMouseOver={ this.props.enlargeMenu }
        style={ containerStyle }
      >
        <span
          style={ {
            bottom: 0,
            position: 'absolute',
          } }
        >
          <FloatingActionButton
            onClick={ this.props.showManagementList }
            iconStyle={ {
              color: this.props.muiTheme.palette.alternateTextColor,
              height: this.props.radius,
              width: this.props.radius,
            } }
            style={ fabStyle }
          >
            <FontAwesome
              name="bars"
              style={ Object.assign(
                {},
                fontStyle,
                {
                  fontSize: Math.ceil(this.props.radius / 2),
                  height: this.props.radius,
                  lineHeight: `${this.props.radius}px`,
                  width: this.props.radius,
                }
              ) }
            />
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
              {
                this.props.activeLevel === 'sample' &&
                <MenuItem
                  key="update"
                  onClick={ this.props.updateMenuAction }
                  primaryText={ [<FontAwesome key="update" name="refresh" />, ' Update ', this.props.activeLevel, ' store'] }
                />
              }
              { this.props.activeLevel === 'project' &&
                this.props.selected &&
                <MenuItem
                  key="manage"
                  onClick={ this.props.manageMenuAction }
                  primaryText={ [<FontAwesome key="manage" name="user-plus" />, ' Manage users'] }
                />
              }
              { this.props.activeLevel === 'experiment' &&
                <MenuItem
                  key="protocol"
                  onClick={ this.props.protocolMenuAction }
                  primaryText={ [<FontAwesome key="protocol" name="file-text-o" />, ' Manage protocols '] }
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
      </div>
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
  enlargeMenu: PropTypes.func.isRequired,
  hideManagementList: PropTypes.func.isRequired,
  manageMenuAction: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
    }),
  }).isRequired,
  protocolMenuAction: PropTypes.func.isRequired,
  radius: PropTypes.number.isRequired,
  selected: PropTypes.number,
  showList: PropTypes.bool.isRequired,
  showManagementList: PropTypes.func.isRequired,
  shrinkMenu: PropTypes.func.isRequired,
  updateMenuAction: PropTypes.func.isRequired,
};

export default muiThemeable()(ManagementMenu);
