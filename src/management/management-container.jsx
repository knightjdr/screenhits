import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';

import { getData } from '../state/get/data-actions';
// import { isObjectEqualLoose } from '../helpers/helpers';
import Management from './management';
import { setIndex } from '../state/set/index-actions';

class ManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLevel: 'project',
      routeCanUpdate: false,
      showList: false,
      viewIcon: 'sitemap',
      viewType: 'hierarchy',
    };
  }
  componentWillMount = () => {
    // when component first mounts, retrieve user project and set index is specified
    this.fillProjectState(this.props);
  }
  componentDidMount = () => {
    this.state.routeCanUpdate = true;
    window.onpopstate = this.onBackForwardButton;
  }
  componentWillReceiveProps = (nextProps) => {
    // if "selected" indices have change, update underlying data
    if (!deepEqual(nextProps.selected, this.props.selected)) {
      this.updateState(nextProps.selected);
    }
  }
  onBackForwardButton = () => {
    if (!deepEqual(this.props.queryParams, this.props.selected)) {
      this.updateState(this.props.queryParams, true);
    }
  }
  changeLevel = (type) => {
    if (type !== this.state.activeLevel) {
      const newState = this.state.showList ?
      {
        activeLevel: type,
        showList: false,
      } :
      {
        activeLevel: type,
      };
      this.setState(newState);
    }
  }
  changeView = () => {
    const newState = this.state.viewType === 'hierarchy' ?
    {
      viewIcon: 'list',
      viewType: 'list',
    } :
    {
      viewIcon: 'sitemap',
      viewType: 'hierarchy',
    };
    this.setState(newState);
  }
  fillProjectState = (props) => {
    props.getData('project', {}, props.selected.project);
    /* if (props.selected.project) {
      const filters = {
        project: props.selected.project,
      };
      props.getData('screen', filters, props.selected.screen);
    }
    if (
      props.selected.project &&
      props.selected.screen
    ) {
      currentLevel = 'screen';
      const filters = {
        project: props.selected.project,
        screen: props.selected.screen,
      };
      props.getData('experiment', filters, props.selected.experiment);
    }
    if (
      props.selected.project &&
      props.selected.screen &&
      props.selected.experiment
    ) {
      currentLevel = 'experiment';
      const filters = {
        experiment: props.selected.experiment,
        project: props.selected.project,
        screen: props.selected.screen,
      };
      props.getData('sample', filters, props.selected.sample);
    }
    if (
      props.selected.project &&
      props.selected.screen &&
      props.selected.experiment &&
      props.selected.screen
    ) {
      currentLevel = 'screen';
    }
    this.setState({
      activeLevel: currentLevel,
    });*/
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
  updateState = (selected) => {
    let currentLevel = 'project';
    let path = 'management?';
    let updateRoute = false;
    if (selected.project) {
      path += `project=${selected.project}`;
      if (
        selected.project !== this.props.selected.project
      ) {
        const filters = {
          project: selected.project,
        };
        this.props.getData('screen', filters);
        this.props.setIndex('project', selected.project);
        updateRoute = true;
      }
    }
    if (
      selected.project &&
      selected.screen &&
      !updateRoute
    ) {
      currentLevel = 'screen';
      path += `&screen=${selected.screen}`;
      if (selected.screen !== this.props.selected.screen) {
        const filters = {
          project: selected.project,
          screen: selected.screen,
        };
        this.props.getData('experiment', filters);
        this.props.setIndex('screen', selected.screen);
        updateRoute = true;
      }
    }
    if (
      selected.project &&
      selected.screen &&
      selected.experiment &&
      !updateRoute
    ) {
      currentLevel = 'experiment';
      path += `&experiment=${selected.experiment}`;
      if (selected.experiment !== this.props.selected.experiment) {
        const filters = {
          experiment: selected.experiment,
          project: selected.project,
          screen: selected.screen,
        };
        this.props.getData('sample', filters);
        this.props.setIndex('experiment', selected.experiment);
        updateRoute = true;
      }
    }
    if (
      selected.project &&
      selected.screen &&
      selected.experiment &&
      selected.sample &&
      !updateRoute
    ) {
      currentLevel = 'sample';
      path += `&sample=${selected.sample}`;
      if (selected.sample !== this.props.selected.sample) {
        this.props.setIndex('sample', selected.sample);
        updateRoute = true;
      }
    }
    this.setState({
      activeLevel: currentLevel,
    });
    if (
      this.state.routeCanUpdate &&
      updateRoute &&
      path !== this.props.path
    ) {
      browserHistory.push(path);
    }
  }
  render() {
    return (
      <Management
        activeLevel={ this.state.activeLevel }
        anchorEl={ this.state.anchorEl }
        available={ this.props.available }
        changeLevel={ this.changeLevel }
        changeView={ this.changeView }
        hideList={ this.hideList }
        selected={ this.props.selected }
        showList={ this.showList }
        showListBoolean={ this.state.showList }
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
  getData: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  queryParams: PropTypes.shape({}).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  setIndex: PropTypes.func.isRequired,
};

let init = true;

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (type, filters, selected) => {
      dispatch(getData(type, filters, selected));
    },
    setIndex: (target, _id) => {
      dispatch(setIndex(target, _id));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const path = `${ownProps.location.pathname.substr(1)}${ownProps.location.search}`;
  const queryParams = ownProps.location.query;
  Object.keys(queryParams).forEach((queryParam) => {
    queryParams[queryParam] = Number(queryParams[queryParam]);
  });
  let selectedObj = {};
  if (init) {
    selectedObj = queryParams;
    init = false;
  } else {
    selectedObj = state.selected;
  }
  return {
    available: state.available,
    path,
    queryParams,
    selected: selectedObj,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagementContainer);

export default Details;
