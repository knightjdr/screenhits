import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Management from './management';

class ManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'project',
      showList: false,
      viewIcon: 'sitemap',
      viewType: 'hierarchy',
    };
  }
  /* componentWillReceiveProps = (nextProps) => {
    const = { selected } = nextProps;
    let path = 'management/';
    if(selected.project) {
      path += 'project:' + selected.project;
      if(selected.screen) {
        path += '/screen:' + selected.screen;
        if(selected.experiment) {
          path += '/experiment:' + selected.experiment;
          if(selected.sample) {
            path += '/sample:' + selected.sample;
          }
        }
      }
    }
    console.log(path);
    browserHistory.push(path)
  } */
  changeActive = (type) => {
    this.setState({ activeTab: type });
    if (this.state.showList) {
      this.setState({
        showList: false,
      });
    }
  }
  changeView = () => {
    if (this.state.viewType === 'hierarchy') {
      this.setState({ viewIcon: 'list', viewType: 'list' });
    } else {
      this.setState({ viewIcon: 'sitemap', viewType: 'hierarchy' });
    }
  }
  hideList = () => {
    this.setState({
      showList: false,
    });
  }
  showList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  render() {
    return (
      <Management
        activeTab={ this.state.activeTab }
        anchorEl={ this.state.anchorEl }
        available={ this.props.available }
        changeActive={ this.changeActive }
        changeView={ this.changeView }
        hideList={ this.hideList }
        selected={ this.props.selected }
        showList={ this.showList }
        viewIcon={ this.state.viewIcon }
        viewType={ this.state.viewType }

      />
    );
  }
}

ManagementContainer.propTypes = {
  available: PropTypes.shape({
    experiment: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    project: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    sample: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    screen: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
  }).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
};

let init = true;

const mapStateToProps = (state, ownProps) => {
  let selectedObj = {};
  if (init) {
    Object.keys(ownProps.params).forEach((key) => {
      selectedObj[key] = ownProps.params[key];
    });
    init = false;
  } else {
    selectedObj = state.selected;
  }
  return {
    available: state.available,
    selected: selectedObj,
  };
};

const Details = connect(
  mapStateToProps,
)(ManagementContainer);

export default Details;