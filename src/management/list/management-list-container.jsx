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
    const filters = this.getFiltersFromRoute(
      routeState.level,
      this.props.queryParams
    );
    const items = this.filterItems(
      this.props.availableList[routeState.level].items,
      filters,
      routeState.level
    );
    const dateRange = this.getDateRange(items);
    this.state = {
      activeLevel: routeState.level,
      dateRange,
      filterDialogState: {
        show: false,
      },
      filters,
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
    this.verifyRoute(
      this.props.params,
      this.props.path,
      this.props.queryParams,
      this.props.user.name
    );
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
      this.updateRoute(this.state.filters, nextState.activeLevel);
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
  getFilters = (filters, level, defaultFilters = false, userName) => {
    const acceptedFields = availableLevels.includes(level) ?
      FilterFields[level].map((field) => { return field.value; })
      :
      []
    ;
    const acceptedFilters = defaultFilters ?
    {
      user: userName,
    }
    :
    {};
    Object.keys(filters).forEach((key) => {
      if (
        acceptedFields.includes(key) &&
        filters[key]
      ) {
        acceptedFilters[key] = filters[key];
      }
    });
    return acceptedFilters;
  }
  getFilterString = (filters, level, defaultFilters = false, userName) => {
    const acceptedFilters = this.getFilters(filters, level, defaultFilters, userName);
    const newQueryString = Object.keys(acceptedFilters).sort().map((key) => {
      return `${key}=${acceptedFilters[key]}`;
    }).join('&');
    return newQueryString;
  }
  getFiltersFromRoute = (level, queryParams) => {
    // get acceptable filters from query params
    const filters = this.getFilters(queryParams, level);
    // correct 'type' for filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (!isNaN) {
        filters[key] = Number(value);
      } else if (
        key === 'endDate' ||
        key === 'startDate'
      ) {
        filters[key] = new Date(value);
      } else {
        filters[key] = value;
      }
    });
    return filters;
  }
  getHeight = () => {
    // 240 = 170 to top of table, 20 for bottom padding, 50 for footer
    const rowHeight = window.innerHeight - 240;
    return rowHeight + 111;
  }
  getRouteState = (params) => {
    const routeParams = {};
    if (availableLevels.includes(params.level)) {
      routeParams.level = params.level;
    } else {
      routeParams.level = 'project';
    }
    return routeParams;
  }
  applyFilters = () => {
    this.setState(({ activeLevel, filters }) => {
      this.updateRoute(filters, activeLevel);
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
      const newFilters = Object.assign({}, filters);
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
          if (!item[expectedName]) {
            return false;
          } else if (type === 'arrNumber') {
            const terms = filters[filterField].split(/\s+/);
            return terms.some((term) => {
              return item[expectedName].includes(Number(term));
            });
          } else if (type === 'arrString') {
            const terms = filters[filterField].split(/\s+/);
            return terms.some((term) => {
              return item[expectedName].includes(term);
            });
          } else if (type === 'date') {
            const place = FilterFields[level][fieldIndex].place;
            if (place === 'start') {
              return Moment(item[expectedName], 'MMMM Do YYYY, h:mm a').format('x') >=
              Moment(filters[filterField]).format('x');
            }
            return Moment(item[expectedName], 'MMMM Do YYYY, h:mm a').format('x') <=
            Moment(filters[filterField]).format('x');
          } else if (type === 'number') {
            return item[expectedName] === filters[filterField];
          } else if (type === 'select') {
            return item[expectedName] === filters[filterField];
          } else if (type === 'text') {
            const re = new RegExp(filters[filterField], 'i');
            return re.test(item[expectedName]);
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
  showHierarchy = (_id, parents) => {
    if (_id) {
      const parentsObject = {};
      if (parents) {
        const parentsArray = parents.split(', ');
        parentsArray.forEach((parent) => {
          const parentValue = parent.split('-');
          parentsObject[parentValue[0]] = parentValue[1];
        });
      }
      let route = '';
      switch (this.state.activeLevel) {
        case 'project':
          route = `/management/hierarchy?project=${_id}`;
          break;
        case 'screen':
          route = `/management/hierarchy?project=${parentsObject.P}&screen=${_id}`;
          break;
        case 'experiment':
          route = `/management/hierarchy?project=${parentsObject.P}&screen=${parentsObject.S}&experiment=${_id}`;
          break;
        case 'sample':
          route = `/management/hierarchy?project=${parentsObject.P}&screen=${parentsObject.S}&experiment=${parentsObject.E}&sample=${_id}`;
          break;
        default:
          break;
      }
      if (route) {
        browserHistory.push(route);
      }
    }
  }
  showList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  verifyRoute = (params, path, queryParams, userName) => {
    const queryString = this.getFilterString(queryParams, params.level, true, userName);
    let newPath;
    if (
      availableLevels.includes(params.level) &&
      queryString
    ) {
      newPath = `/management/list/${params.level}?${queryString}`;
    } else {
      newPath = '/management/list/project';
    }
    if (newPath !== `/${decodeURI(path)}`) {
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
      Moment(newFilters.endDate).format('x') > Moment(dateRange.end.max).format('x')
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
  updateRoute = (filters, level) => {
    const filterString = this.getFilterString(filters, level);
    browserHistory.replace(`/management/list/${level}?${filterString}`);
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
        showHierarchy={ this.showHierarchy }
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
  queryParams: PropTypes.shape({}).isRequired,
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
  const queryParams = ownProps.location.query;
  Object.keys(queryParams).forEach((queryParam) => {
    if (!isNaN(queryParams[queryParam])) {
      queryParams[queryParam] = Number(queryParams[queryParam]);
    }
  });
  return {
    availableList: state.availableList,
    path,
    queryParams,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagementListContainer);

export default Details;
