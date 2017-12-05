import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';

import ManagementList from './management-list';

class ManagementListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLevel: 'project',
      showList: false,
    };
  }
  changeLevel = (type) => {
    this.setState(({ activeLevel }) => {
      if (type !== activeLevel) {
        const newState = this.state.showList ?
        {
          activeLevel: type,
          showList: false,
        } :
        {
          activeLevel: type,
        };
        return newState;
      }
      return {};
    });
  }
  changeView = () => {
    browserHistory.replace('/management/hierarchy');
  }
  /* checkRoute = (params, path) => {
    const routeParams = {};
    let newPath;
    if (
      params.view === 'list' &&
      availableLevels.includes(params.level) &&
      !isNaN(params.id)
    ) {
      routeParams.id = Number(params.id);
      routeParams.level = params.level;
      routeParams.view = 'list';
      newPath = `management/list/${params.level}/${params.id}`;
    } else if (
      params.view === 'list' &&
      availableLevels.includes(params.level)
    ) {
      routeParams.id = null;
      routeParams.level = params.level;
      routeParams.view = 'list';
      newPath = `management/list/${params.level}`;
    } else if (
      params.view === 'list' &&
      (
        !params.level ||
        !availableLevels.includes(params.level)
      )
    ) {
      routeParams.id = null;
      routeParams.level = 'project';
      routeParams.view = 'list';
      newPath = 'management/list/project';
    } if (
      params.view === 'list' &&
      availableLevels.includes(params.level) &&
      !isNaN(params.id)
    ) {
      routeParams.id = Number(params.id);
      routeParams.level = params.level;
      routeParams.view = 'list';
      newPath = path;
    } else {
      routeParams.id = null;
      routeParams.level = 'project';
      routeParams.view = 'hierachy';
      newPath = 'management/hierarchy';
    }
    if (newPath !== path) {
      browserHistory.replace(newPath);
    }
    console.log(params, routeParams, path, newPath);
    return routeParams;
  } */
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
      <ManagementList
        activeLevel={ this.state.activeLevel }
        anchorEl={ this.state.anchorEl }
        changeLevel={ this.changeLevel }
        changeView={ this.changeView }
        hideList={ this.hideList }
        showList={ this.showList }
        showListBoolean={ this.state.showList }
        transitionState={ this.state.transitionState }
      />
    );
  }
}

ManagementListContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const path = `${ownProps.location.pathname.substr(1)}${ownProps.location.search}`;
  return {
    path,
  };
};

const Details = connect(
  mapStateToProps,
)(ManagementListContainer);

export default Details;
