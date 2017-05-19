import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { setIndex } from '../../state/set/index-actions';
import ManagementSelection from './management-selection';

const icons = {
  experiment: <FontAwesome key="experiment" name="bar-chart" />,
  project: <FontAwesome key="project" name="folder-open" />,
  sample: <FontAwesome key="sample" name="flask" />,
  screen: <FontAwesome key="screen" name="braille" />,
};

class ManagementSelectionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonClass: this.props.activeLevel === this.props.type ? 'active' : 'default',
      buttonName: this.buttonName(),
      hovered: false,
      showPopoverBoolean: false,
      toggleIcon: <FontAwesome name="angle-down" />,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateButton);
  }
  componentWillUpdate = (nextProps) => {
    const { activeLevel } = nextProps;
    if (activeLevel !== this.props.activeLevel) {
      this.setState({
        buttonClass: activeLevel === this.props.type ? 'active' : 'default',
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateButton);
  }
  onHoverEnter = () => {
    this.setState({
      hovered: true,
    });
  }
  onHoverLeave = () => {
    this.setState({
      hovered: false,
    });
  }
  buttonName = () => {
    return window.innerWidth > 680 ? this.props.type : icons[this.props.type];
  }
  changeLevel = (e) => {
    this.props.changeLevel(this.props.type);
    this.showPopover(e);
  }
  hidePopover = () => {
    this.setState({
      showPopoverBoolean: false,
      toggleIcon: <FontAwesome name="angle-down" />,
    });
  }
  selectItem = (type, item) => {
    this.hidePopover();
    this.props.changeSelected(item);
  }
  showPopover = (event) => {
    if (this.props.activeLevel === this.props.type) {
      this.setState({
        anchorEl: event.currentTarget,
        showPopoverBoolean: true,
        toggleIcon: <FontAwesome name="angle-up" />,
      });
    }
  }
  updateButton = () => {
    this.setState({
      buttonName: this.buttonName(),
    });
  }
  render() {
    return (
      <ManagementSelection
        anchorEl={ this.state.anchorEl }
        buttonClass={ this.state.buttonClass }
        buttonName={ this.state.buttonName }
        changeLevel={ this.changeLevel }
        details={ this.props.details }
        hidePopover={ this.hidePopover }
        hovered={ this.state.hovered }
        onHoverEnter={ this.onHoverEnter }
        onHoverLeave={ this.onHoverLeave }
        selected={ this.props.selected }
        selectItem={ this.selectItem }
        showPopoverBoolean={ this.state.showPopoverBoolean }
        toggleIcon={ this.state.toggleIcon }
        type={ this.props.type }
      />
    );
  }
}

ManagementSelectionContainer.defaultProps = {
  selected: null,
};

ManagementSelectionContainer.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  changeLevel: PropTypes.func.isRequired,
  details: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  changeSelected: PropTypes.func.isRequired,
  selected: PropTypes.number,
  type: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeSelected: (selected) => {
      dispatch(setIndex(ownProps.type, selected));
    },
  };
};

const Selection = connect(
  null,
  mapDispatchToProps,
)(ManagementSelectionContainer);

export default Selection;
