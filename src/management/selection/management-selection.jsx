import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

import './management-selection.scss';

class ManagementSelection extends React.Component {
  componentDidMount = () => {
    window.addEventListener('resize', this.props.updateButton);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.props.updateButton);
  }
  render() {
    return (
      <span className="management-selection">
        <RaisedButton
          className={ this.props.buttonClass }
          icon={ this.props.toggleIcon }
          label={ [this.props.buttonName, ': ', this.props.selected ? this.props.selected : '∅'] }
          onClick={ this.props.showList }
        />
        <Popover
          anchorEl={ this.props.anchorEl }
          anchorOrigin={ {
            horizontal: 'left',
            vertical: 'bottom',
          } }
          animation={ PopoverAnimationVertical }
          className="management-selection-popover"
          onRequestClose={ this.props.hideList }
          open={ this.props.showListBoolean }
          targetOrigin={ {
            horizontal: 'left',
            vertical: 'top',
          } }
        >
          <Menu>
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
  details: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  selected: PropTypes.number,
  selectItem: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
  showListBoolean: PropTypes.bool.isRequired,
  toggleIcon: PropTypes.shape({
  }).isRequired,
  type: PropTypes.string.isRequired,
  updateButton: PropTypes.func.isRequired,
};

export default ManagementSelection;
