import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';

import Management from './management';
import { getData, getRouteData } from '../state/get/data-actions';
import { isObjectLooseEqual, objectEmpty } from '../helpers/helpers';
import { routeLoaded } from '../state/routing/routeload-actions';
import { setIndex } from '../state/set/index-actions';

class ManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLevel: 'project',
      transitionState: 'entering',
      showList: false,
      viewIcon: 'sitemap',
      viewType: 'hierarchy',
    };
  }
  componentWillMount = () => {
    // when component first mounts, retrieve user project or route-based details
    if (!objectEmpty(this.props.queryParams)) {
      this.fillProjectState(this.props.queryParams);
    } else {
      this.props.getData('project', {});
      this.props.routeLoaded();
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const { location, queryParams, routeLoading, selected } = nextProps;
    // if "selected" indices have changed, update underlying data and route
    if (
      !routeLoading &&
      location.action === 'POP' &&
      !isObjectLooseEqual(queryParams, this.props.selected)
    ) {
      this.props.setIndex('all', queryParams);
    } else if (
      !routeLoading &&
      !isObjectLooseEqual(selected, queryParams)
    ) {
      this.updateState(selected, queryParams);
    } else if (
      !routeLoading &&
      !isObjectLooseEqual(selected, this.props.selected)
    ) {
      this.updateState(selected, this.props.selected);
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
  fillProjectState = (selected) => {
    this.props.getRouteData(selected);
    this.setState({
      activeLevel: this.findActiveLevel(selected),
    });
  }
  findActiveLevel = (selected) => {
    let activeLevel;
    if (selected.sample) {
      activeLevel = 'sample';
    } else if (selected.experiment) {
      activeLevel = 'experiment';
    } else if (selected.screen) {
      activeLevel = 'screen';
    } else {
      activeLevel = 'project';
    }
    return activeLevel;
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
  updateState = (selected, lastSelected) => {
    let continuteUpdate = true;
    let path = 'management?';
    const setSelected = {
      experiment: null,
      project: null,
      sample: null,
      screen: null,
    };
    if (objectEmpty(selected)) {
      path = 'management';
      continuteUpdate = false;
    }
    if ( // project has been selected, and it exists
      continuteUpdate &&
      selected.project &&
      this.props.available.project.items.findIndex((projectItem) => {
        return projectItem._id === selected.project;
      }) > -1
    ) {
      continuteUpdate = true;
      path += `project=${selected.project}`;
      setSelected.project = selected.project;
      if (
        selected.project !== lastSelected.project
      ) {
        continuteUpdate = false;
        const filters = {
          project: selected.project,
        };
        this.props.getData('screen', filters);
        this.props.setIndex('project', selected.project);
      }
    }
    if ( // screen has been selected, and it exists
      continuteUpdate &&
      setSelected.project &&
      selected.screen &&
      this.props.available.screen.items.findIndex((screenItem) => {
        return screenItem._id === selected.screen;
      }) > -1
    ) {
      continuteUpdate = true;
      path += `&screen=${selected.screen}`;
      setSelected.screen = selected.screen;
      if (
        selected.screen !== lastSelected.screen
      ) {
        continuteUpdate = false;
        const filters = {
          project: selected.project,
          screen: selected.screen,
        };
        this.props.getData('experiment', filters);
        this.props.setIndex('screen', selected.screen);
      }
    }
    if ( // experiment has been selected, and it exists
      continuteUpdate &&
      setSelected.project &&
      setSelected.screen &&
      selected.experiment &&
      this.props.available.experiment.items.findIndex((experimentItem) => {
        return experimentItem._id === selected.experiment;
      }) > -1
    ) {
      continuteUpdate = true;
      path += `&experiment=${selected.experiment}`;
      setSelected.experiment = selected.experiment;
      if (
        selected.experiment !== lastSelected.experiment
      ) {
        continuteUpdate = false;
        const filters = {
          experiment: selected.experiment,
          project: selected.project,
          screen: selected.screen,
        };
        this.props.getData('sample', filters);
        this.props.setIndex('experiment', selected.experiment);
      }
    }
    if ( // sample has been selected, and it exists
      continuteUpdate &&
      setSelected.project &&
      setSelected.screen &&
      setSelected.experiment &&
      selected.sample &&
      this.props.available.sample.items.findIndex((sampleItem) => {
        return sampleItem._id === selected.sample;
      }) > -1
    ) {
      path += `&sample=${selected.sample}`;
      setSelected.sample = selected.sample;
      if (
        selected.sample !== lastSelected.sample
      ) {
        this.props.setIndex('sample', selected.sample);
      }
    }
    // check is last state still exist. If not, replace browserHistory
    let lastExists = true;
    Object.keys(lastSelected).forEach((level) => {
      if (
        lastSelected[level] &&
        this.props.available[level].items.findIndex((levelItem) => {
          return levelItem._id === lastSelected[level];
        }) < 0
      ) {
        lastExists = false;
      }
    });
    // update route
    if (path !== this.props.path) {
      lastExists ? browserHistory.push(path) : browserHistory.replace(path);
    }
    // update state
    this.setState({ activeLevel: this.findActiveLevel(setSelected) });
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
        transitionState={ this.state.transitionState }
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
  getRouteData: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  path: PropTypes.string.isRequired,
  queryParams: PropTypes.shape({}).isRequired,
  routeLoaded: PropTypes.func.isRequired,
  routeLoading: PropTypes.bool.isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  setIndex: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (type, filters, selected) => {
      dispatch(getData(type, filters, selected));
    },
    getRouteData: (selected) => {
      dispatch(getRouteData(selected));
    },
    routeLoaded: () => {
      dispatch(routeLoaded());
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
  return {
    available: state.available,
    routeLoading: state.route.loading,
    path,
    queryParams,
    selected: state.selected,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagementContainer);

export default Details;
