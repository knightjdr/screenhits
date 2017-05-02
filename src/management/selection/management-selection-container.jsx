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
      buttonClass: this.props.active === this.props.type ?
        'management-selection-button-active ' :
        'management-selection-button',
      buttonName: this.buttonName(),
      showList: false,
      toggleIcon: <FontAwesome name="angle-down" />,
    };
  }
  componentWillUpdate = (nextProps) => {
    const { active } = nextProps;
    if (active !== this.props.active) {
      this.setState({
        buttonClass: active === this.props.type ?
          'management-selection-button-active '
          :
          'management-selection-button'
        ,
      });
    }
  }
  buttonName = () => {
    return window.innerWidth > 680 ? this.props.type : icons[this.props.type];
  }
  hideList = () => {
    this.setState({
      showList: false,
      toggleIcon: <FontAwesome name="angle-down" />,
    });
  }
  selectItem = (type, item) => {
    this.hideList();
    this.props.changeSelected(item);
  }
  showList = (event) => {
    if (this.props.active === this.props.type) {
      this.setState({
        anchorEl: event.currentTarget,
        showList: true,
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
        details={ this.props.details }
        hideList={ this.hideList }
        selected={ this.props.selected }
        selectItem={ this.selectItem }
        showList={ this.showList }
        showListBoolean={ this.state.showList }
        toggleIcon={ this.state.toggleIcon }
        type={ this.props.type }
        updateButton={ this.updateButton }
      />
    );
  }
}

ManagementSelectionContainer.defaultProps = {
  selected: null,
};

ManagementSelectionContainer.propTypes = {
  active: PropTypes.string.isRequired,
  details: PropTypes.shape({
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
