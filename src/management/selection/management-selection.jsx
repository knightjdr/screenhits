import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

class ManagementSelection extends React.Component {
  componentDidMount = () => {
    window.addEventListener('resize', this.props.updateButton);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.props.updateButton);
  }
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
          onClick={ (e) => {
            this.props.onClick();
            this.props.showList(e);
          } }
          onMouseEnter={ () => { this.props.onHover(true); } }
          onMouseLeave={ () => { this.props.onHover(false); } }
        />
        <Popover
          anchorEl={ this.props.anchorEl }
          anchorOrigin={ {
            horizontal: 'left',
            vertical: 'bottom',
          } }
          animation={ PopoverAnimationVertical }
          onRequestClose={ this.props.hideList }
          open={ this.props.showListBoolean }
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
                  onClick={ () => { this.props.selectItem(this.props.type, item._id); } }
                  primaryText={ `${item._id} : ${item.name}` }
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
  hideList: PropTypes.func.isRequired,
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
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  selected: PropTypes.number,
  selectItem: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
  showListBoolean: PropTypes.bool.isRequired,
  toggleIcon: PropTypes.shape({
  }).isRequired,
  type: PropTypes.string.isRequired,
  updateButton: PropTypes.func.isRequired,
};

export default muiThemeable()(ManagementSelection);
