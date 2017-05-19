import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

class ManagementSelection extends React.Component {
  setButtonColor = (buttonClass, hover) => {
    if (buttonClass === 'default' && hover) {
      return this.props.muiTheme.palette.alternativeButtonColorHover;
    } else if (buttonClass === 'default') {
      return this.props.muiTheme.palette.alternativeButtonColor;
    } else if (buttonClass === 'active' && hover) {
      return this.props.muiTheme.palette.buttonColorHover;
    }
    return this.props.muiTheme.palette.buttonColor;
  }
  selectButton = (e) => {
    const colonIndex = e.target.innerHTML.indexOf(':');
    const _id = Number(e.target.innerHTML.substr(0, colonIndex));
    this.props.selectItem(this.props.type, _id);
  }
  render() {
    return (
      <span
        style={ {
          margin: '2px 2px 2px 2px',
        } }
      >
        <RaisedButton
          backgroundColor={ this.setButtonColor(this.props.buttonClass, this.props.hovered) }
          buttonStyle={ {
            color: this.props.buttonClass === 'default' ?
            this.props.muiTheme.palette.alternateTextColor :
            this.props.muiTheme.palette.alternateTextColor2,
          } }
          icon={ this.props.toggleIcon }
          label={ [this.props.buttonName, ': ', this.props.selected ? this.props.selected : '∅'] }
          labelColor={
            this.props.buttonClass === 'default' ?
            this.props.muiTheme.palette.alternateTextColor :
            this.props.muiTheme.palette.alternateTextColor2
          }
          onClick={ this.props.changeLevel }
          onMouseEnter={ this.props.onHoverEnter }
          onMouseLeave={ this.props.onHoverLeave }
        />
        <Popover
          anchorEl={ this.props.anchorEl }
          anchorOrigin={ {
            horizontal: 'left',
            vertical: 'bottom',
          } }
          animation={ PopoverAnimationVertical }
          onRequestClose={ this.props.hidePopover }
          open={ this.props.showPopoverBoolean }
          targetOrigin={ {
            horizontal: 'left',
            vertical: 'top',
          } }
        >
          <Menu
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
          >
            { this.props.details.isFetching &&
              <MenuItem
                disabled={ true }
                key="fetching"
                primaryText={ [<FontAwesome key="fetching" name="spinner" pulse={ true } />, ' Fetching'] }
              />
            }
            { this.props.details.items.map((item) => {
              return (
                <MenuItem
                  key={ item._id }
                  onClick={ this.selectButton }
                  primaryText={ `${item._id}: ${item.name}` }
                />
              );
            })}
          </Menu>
        </Popover>
      </span>
    );
  }
}

ManagementSelection.defaultProps = {
  anchorEl: {},
  selected: null,
};

ManagementSelection.propTypes = {
  anchorEl: PropTypes.shape({
  }),
  buttonClass: PropTypes.string.isRequired,
  buttonName: PropTypes.oneOfType([
    PropTypes.shape({
    }),
    PropTypes.string,
  ]).isRequired,
  changeLevel: PropTypes.func.isRequired,
  hidePopover: PropTypes.func.isRequired,
  hovered: PropTypes.bool.isRequired,
  details: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
      alternativeButtonColorHover: PropTypes.string,
      alternateTextColor: PropTypes.string,
      alternateTextColor2: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
    }),
  }).isRequired,
  onHoverEnter: PropTypes.func.isRequired,
  onHoverLeave: PropTypes.func.isRequired,
  selected: PropTypes.number,
  selectItem: PropTypes.func.isRequired,
  showPopoverBoolean: PropTypes.bool.isRequired,
  toggleIcon: PropTypes.shape({
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default muiThemeable()(ManagementSelection);
