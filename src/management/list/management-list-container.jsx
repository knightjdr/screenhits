import deepEqual from 'deep-equal';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import FilterFields from './filter-content';
import ManagementList from './management-list';
import getLevelData from '../../state/get/level-actions';
import TableHeader from './list-headers';

const availableLevels = [
  'experiment',
  'project',
  'sample',
  'screen',
];

class ManagementListContainer extends React.Component {
  constructor(props) {
    super(props);
    const routeState = this.getRouteState(this.props.params);
    const items = this.filterItems(
      this.props.availableList[routeState.level].items,
      {
        user: this.props.user.name,
      },
      routeState.level
    );
    const dateRange = this.getDateRange(items);
    this.state = {
      activeLevel: routeState.level,
      dateRange,
      filterDialogState: {
        show: false,
      },
      filters: {
        user: this.props.user.name,
      },
      header: TableHeader[routeState.level],
      itemID: routeState.id,
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
    this.props.getLevelData(this.state.activeLevel);
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const { availableList } = nextProps;
    // if select level items have changed, update state
    if (!deepEqual(
      availableList[this.state.activeLevel],
      this.props.availableList[this.state.activeLevel]
    )) {
      this.updateLevelFromProps(availableList[this.state.activeLevel]);
    }
  }
  componentWillUpdate = (nextProps, nextState) => {
    if (nextState.activeLevel !== this.state.activeLevel) {
      browserHistory.replace(`/management/list/${nextState.activeLevel}`);
      this.props.getLevelData(nextState.activeLevel);
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getDateRange = (items) => {
    const maxDate = Moment(new Date()).format('x');
    let minDate = maxDate;
    items.forEach((item) => {
      const itemDate = Moment(item.creationDate, 'MMMM Do YYYY, h:mm a').format('x');
      if (itemDate < minDate) {
        minDate = itemDate;
      }
    });
    return {
      end: {
        max: Moment(maxDate, 'x').toDate(),
        min: Moment(minDate, 'x').toDate(),
      },
      start: {
        max: Moment(maxDate, 'x').toDate(),
        min: Moment(minDate, 'x').toDate(),
      },
    };
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
          filters,
          activeLevel
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
    this.setState(({ activeLevel, filters }) => {
      const newFilters = Object.assign({}, filters);
      Object.keys(newFilters).forEach((filterField) => {
        const fieldIndex = FilterFields[activeLevel].findIndex((field) => {
          return field.value === filterField;
        });
        newFilters[filterField] = FilterFields[activeLevel][fieldIndex].type === 'text' ?
          ''
          :
          null
        ;
      });
      const items = this.filterItems(
        this.props.availableList[activeLevel].items,
        newFilters,
        activeLevel
      );
      return {
        filters: newFilters,
        items,
        tableHeight: this.getHeight(items),
      };
    });
  }
  filterChange = (field, value) => {
    this.setState(({ filters }) => {
      const newFilters = JSON.parse(JSON.stringify(filters));
      newFilters[field] = value;
      return {
        filters: newFilters,
      };
    });
  }
  filterItems = (items, filters, level) => {
    const newItems = JSON.parse(JSON.stringify(items));
    return newItems.filter((item) => {
      const keep = Object.keys(filters).every((filterField) => {
        if (filters[filterField]) {
          const fieldIndex = FilterFields[level].findIndex((field) => {
            return field.value === filterField;
          });
          const expectedName = FilterFields[level][fieldIndex].expectedName;
          const type = FilterFields[level][fieldIndex].type;
          if (type === 'text') {
            const re = new RegExp(filters[filterField], 'i');
            return re.test(item[expectedName]);
          } else if (type === 'select') {
            return item[expectedName] === filters[filterField];
          } else if (type === 'date') {
            const place = FilterFields[level][fieldIndex].place;
            if (place === 'start') {
              return Moment(item[expectedName], 'MMMM Do YYYY, h:mm a').format('x') >=
              Moment(filters[filterField]).format('x');
            }
            return Moment(item[expectedName], 'MMMM Do YYYY, h:mm a').format('x') <=
            Moment(filters[filterField]).format('x');
          }
          return true;
        }
        return true;
      });
      return keep;
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
  refreshLevel = () => {
    this.props.getLevelData(this.state.activeLevel);
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
  updateFilters = (dateRange, filters, level) => {
    // get array of valid field values for the selected level
    const validFields = FilterFields[level].map((field) => { return field.value; });
    // remove unwanted fields
    const newFilters = Object.assign({}, filters);
    Object.keys(newFilters).forEach((field) => {
      if (!validFields.includes(field)) {
        delete newFilters[field];
      }
    });
    // add missing fields
    validFields.forEach((wantedField) => {
      if (!Object.keys(newFilters).includes(wantedField)) {
        const fieldIndex = FilterFields[level].findIndex((field) => {
          return field.value === wantedField;
        });
        newFilters[wantedField] = FilterFields[level][fieldIndex].type === 'text' ?
          ''
          :
          null
        ;
      }
    });
    // if selected filter dates are outside dateRange, change
    if (
      newFilters.startDate &&
      Moment(newFilters.startDate).format('x') < Moment(dateRange.start.min).format('x')
    ) {
      newFilters.startDate = dateRange.start.min;
    }
    if (
      newFilters.endDate &&
      Moment(newFilters.endDate).format('x') < Moment(dateRange.end.max).format('x')
    ) {
      newFilters.endDate = dateRange.end.max;
    }
    return newFilters;
  }
  updateLevelFromProps = (newLevelList) => {
    this.setState(({ activeLevel, filters }) => {
      const fullList = newLevelList.items;
      let dateRange = { start: { max: null, min: null }, end: { max: null, min: null } };
      let newFilters = filters;
      let items = [];
      if (fullList.length > 0) {
        dateRange = this.getDateRange(fullList);
        newFilters = this.updateFilters(dateRange, filters, activeLevel);
        items = this.filterItems(fullList, newFilters, activeLevel);
      }
      return {
        dateRange,
        filters: newFilters,
        items,
        listStatus: {
          didInvalidate: newLevelList.didInvalidate,
          isFetching: newLevelList.isFetching,
          message: newLevelList.message,
        },
        tableHeight: this.getHeight(items),
      };
    });
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
        dateRange={ this.state.dateRange }
        filterDialogState={ Object.assign(
          {},
          this.state.filterDialogState,
          {
            hideFunc: this.hideFilterDialog,
            showFunc: this.showFilterDialog,
          }
        ) }
        filterChange={ this.filterChange }
        filters={ this.state.filters }
        header={ this.state.header }
        hideList={ this.hideList }
        items={ this.state.items }
        itemID={ this.state.itemID }
        listStatus={ this.state.listStatus }
        refreshLevel={ this.refreshLevel }
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
    name: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLevelData: (level) => {
      dispatch(getLevelData(level));
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
