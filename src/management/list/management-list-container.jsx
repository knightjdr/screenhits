import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import ManagementList from './management-list';
import getLevelData from '../../state/get/level-actions';
import TableHeader from './list-headers';

const availableLevels = [
  'experiment',
  'project',
  'sample',
  'screen',
];
const defaultFilters = {
};

class ManagementListContainer extends React.Component {
  constructor(props) {
    super(props);
    const routeState = this.getRouteState(this.props.params);
    const items = this.filterItems(
      this.props.availableList[routeState.level].items,
      {
        user: this.props.user.name,
      }
    );
    this.state = {
      activeLevel: routeState.level,
      filterDialogState: {
        show: false,
      },
      filters: {
        user: this.props.user.name,
      },
      header: TableHeader[routeState.level],
      id: routeState.id,
      items,
      listStatus: {
        didInvalidate: false,
        isFetching: true,
        message: '',
      },
      showList: false,
      tableHeight: this.getHeight(items),
    };
  }
  componentWillMount = () => {
    this.verifyRoute(this.props.params, this.props.path);
  }
  componentDidMount = () => {
    this.props.getLevelData(this.state.activeLevel, this.props.user);
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const { availableList } = nextProps;
    if (!deepEqual(
      availableList[this.state.activeLevel],
      this.props.availableList[this.state.activeLevel]
    )) {
      this.setState(({ activeLevel, filters }) => {
        const fullList = availableList[activeLevel].items;
        const items = fullList.length > 0 ?
          this.filterItems(fullList, filters)
          :
          []
        ;
        return {
          items,
          listStatus: {
            didInvalidate: availableList[activeLevel].didInvalidate,
            isFetching: availableList[activeLevel].isFetching,
            message: availableList[activeLevel].message,
          },
          tableHeight: this.getHeight(items),
        };
      });
    }
  }
  componentWillUpdate = (nextProps, nextState) => {
    if (nextState.activeLevel !== this.state.activeLevel) {
      browserHistory.replace(`/management/list/${nextState.activeLevel}`);
      this.props.getLevelData(nextState.activeLevel, nextProps.user);
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getHeight = (table) => {
    // 240 = 170 to top of table, 20 for bottom padding, 50 for footer
    const maxHeightRows = window.innerHeight - 240;
    const neededHeightRows = (table.length * 50);
    let rowHeight = neededHeightRows < maxHeightRows ? neededHeightRows : maxHeightRows;
    // must give space for at least one row
    if (rowHeight < 50) {
      rowHeight = 50;
    }
    return rowHeight + 111;
  }
  getRouteState = (params) => {
    const routeParams = {};
    if (
      availableLevels.includes(params.level) &&
      !isNaN(params.id)
    ) {
      routeParams.id = Number(params.id);
      routeParams.level = params.level;
    } else if (
      availableLevels.includes(params.level)
    ) {
      routeParams.id = null;
      routeParams.level = params.level;
    } else {
      routeParams.id = null;
      routeParams.level = 'project';
    }
    return routeParams;
  }
  applyFilters = () => {
    this.setState(({ activeLevel, filters }) => {
      return {
        items: this.filterItems(
          this.props.availableList[activeLevel].items,
          filters
        ),
      };
    });
  }
  changeLevel = (newLevel) => {
    this.setState(({ activeLevel }) => {
      if (newLevel !== activeLevel) {
        return {
          activeLevel: newLevel,
          header: TableHeader[newLevel],
          showList: false,
          listStatus: {
            didInvalidate: false,
            isFetching: true,
            message: '',
          },
        };
      }
      return {};
    });
  }
  changeView = () => {
    browserHistory.replace('/management/hierarchy');
  }
  clearFilters = () => {
    const filters = Object.assign(
      {},
      defaultFilters,
      {
        user: '',
      }
    );
    this.setState(({ activeLevel }) => {
      return {
        filters,
        items: this.filterItems(
          this.props.availableList[activeLevel].items,
          filters
        ),
      };
    });
  }
  filterItems = (items, filters) => {
    return items.filter((item) => {
      const userRE = new RegExp(filters.user);
      if (
        filters.user &&
        !userRE.test(item.creatorName)
      ) {
        return false;
      }
      return true;
    });
  }
  filterUser = (e) => {
    const user = e.target.value;
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            user,
          },
        ),
      };
    });
  }
  hideFilterDialog = () => {
    this.setState({
      filterDialogState: {
        show: false,
      },
    });
  }
  hideList = () => {
    this.setState({
      showList: false,
    });
  }
  resize = () => {
    this.setState(({ items }) => {
      return {
        tableHeight: this.getHeight(items),
      };
    });
  }
  showFilterDialog = () => {
    this.setState({
      filterDialogState: {
        show: true,
      },
    });
  }
  showList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  verifyRoute = (params, path) => {
    let newPath;
    if (
      availableLevels.includes(params.level) &&
      !isNaN(params.id)
    ) {
      newPath = `/management/list/${params.level}/${params.id}`;
    } else if (
      availableLevels.includes(params.level)
    ) {
      newPath = `/management/list/${params.level}`;
    } else {
      newPath = '/management/list/project';
    }
    if (newPath !== `/${path}`) {
      browserHistory.replace(newPath);
    }
  }
  render() {
    return (
      <ManagementList
        activeLevel={ this.state.activeLevel }
        anchorEl={ this.state.anchorEl }
        applyFilters={ this.applyFilters }
        changeLevel={ this.changeLevel }
        changeView={ this.changeView }
        clearFilters={ this.clearFilters }
        filterDialogState={ Object.assign(
          {},
          this.state.filterDialogState,
          {
            hideFunc: this.hideFilterDialog,
            showFunc: this.showFilterDialog,
          }
        ) }
        filterFuncs={ {
          user: this.filterUser,
        } }
        filters={ this.state.filters }
        header={ this.state.header }
        hideList={ this.hideList }
        items={ this.state.items }
        listStatus={ this.state.listStatus }
        showList={ this.showList }
        showListBoolean={ this.state.showList }
        tableHeight={ this.state.tableHeight }
        transitionState={ this.state.transitionState }
      />
    );
  }
}

ManagementListContainer.propTypes = {
  availableList: PropTypes.shape({
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
  getLevelData: PropTypes.func.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string,
    view: PropTypes.string,
  }).isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLevelData: (level, user) => {
      dispatch(getLevelData(level, user));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const path = `${ownProps.location.pathname.substr(1)}${ownProps.location.search}`;
  return {
    availableList: state.availableList,
    path,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagementListContainer);

export default Details;
