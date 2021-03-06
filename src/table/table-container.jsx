import deepEqual from 'deep-equal';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Table from './table';

class TableContainer extends React.Component {
  constructor(props) {
    super(props);
    const pageLength = this.getPageLength(this.props.height);
    this.state = {
      page: 0,
      pageData: this.getPageData(0, pageLength, this.props.data.list),
      pageLength,
      pageTotal: this.getPageTotal(pageLength, this.props.data.list),
      sortCursor: this.props.data.header.map((column) => {
        return column.sort ? 'n-resize' : 'default';
      }),
      sortDirection: this.props.data.header.map(() => {
        return 'desc';
      }),
      sortIndex: -1,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.reset !== this.props.reset) {
      this.resetTable(nextProps);
    } else if (!deepEqual(nextProps.data.header, this.props.data.header)) {
      this.updateHeader(nextProps);
    } else if (!deepEqual(nextProps.data.list, this.props.data.list)) {
      this.updateList(nextProps, this.props);
    } else if (nextProps.height !== this.props.height) {
      this.changeHeight(nextProps);
    }
  }
  getPageData = (page, pageLength, list) => {
    return list.slice(page * pageLength, (page * pageLength) + pageLength);
  }
  getPageLength = (height) => {
    // 58 = table header, 51 = table footer
    return Math.floor((height - 58 - 51) / 50);
  }
  getPageTotal = (pageLength, list) => {
    return Math.ceil(list.length / pageLength) - 1;
  }
  changeHeight = (nextProps) => {
    const pageLength = this.getPageLength(this.props.height);
    if (pageLength !== this.state.pageLength) {
      let page = this.state.page;
      if ((page * pageLength) >= nextProps.data.list.length) {
        page -= 1;
      }
      this.setState((prevState) => {
        return {
          page,
          pageData: this.getPageData(
            page,
            pageLength,
            this.sortInputData(
              nextProps.data.list,
              prevState.sortIndex,
              prevState.sortIndex > -1 ? prevState.sortDirection[prevState.sortIndex] : null,
            ),
          ),
          pageLength,
          pageTotal: this.getPageTotal(pageLength, nextProps.data.list),
        };
      });
    }
  }
  changePage = (direction) => {
    this.setState((prevState) => {
      const newPage = direction === 'down' ? prevState.page - 1 : prevState.page + 1;
      return {
        page: newPage,
        pageData: this.sortInputData(
          this.props.data.list,
          prevState.sortIndex,
          prevState.sortIndex > -1 ? prevState.sortDirection[prevState.sortIndex] : null,
        ).slice(
          newPage * prevState.pageLength,
          (newPage * prevState.pageLength) + prevState.pageLength,
        ),
      };
    });
  }
  resetTable = (nextProps) => {
    const pageLength = this.getPageLength(nextProps.height);
    this.setState({
      page: 0,
      pageData: this.getPageData(
        0,
        pageLength,
        nextProps.data.list,
      ),
      pageLength,
      pageTotal: this.getPageTotal(pageLength, nextProps.data.list),
      sortCursor: nextProps.data.header.map((column) => {
        return column.sort ? 'n-resize' : 'default';
      }),
      sortDirection: nextProps.data.header.map(() => {
        return 'desc';
      }),
      sortIndex: -1,
    });
  }
  sortInputData = (arr, index, direction, isDate) => {
    if (index < 0) {
      return arr;
    }
    const returnValue = direction === 'asc' ? -1 : 1;
    const sortValue = (val) => {
      if (isDate) {
        return Moment(val, 'MMMM Do YYYY, h:mm a').format('x');
      } else if (typeof val === 'number') {
        return val;
      }
      return val.toUpperCase();
    };
    arr.sort((a, b) => {
      const nameA = sortValue(a.columns[index].value);
      const nameB = sortValue(b.columns[index].value);
      if (nameA < nameB) {
        return returnValue;
      }
      if (nameA > nameB) {
        return -returnValue;
      }
      // for when the value is the same, use the key which has to be unique
      const keyA = a.key.toUpperCase();
      const keyB = b.key.toUpperCase();
      if (keyA < keyB) {
        return returnValue;
      }
      if (keyA > keyB) {
        return -returnValue;
      }
      return 0;
    });
    return arr;
  }
  sortTable = (index, type) => {
    const sortCursor = this.state.sortCursor;
    sortCursor[index] = sortCursor[index] === 'n-resize' ? 's-resize' : 'n-resize';
    const sortDirection = this.state.sortDirection;
    sortDirection[index] = sortDirection[index] === 'asc' ? 'desc' : 'asc';
    this.setState((prevState) => {
      return {
        pageData: this.getPageData(
          prevState.page,
          prevState.pageLength,
          this.sortInputData(
            this.props.data.list,
            index,
            sortDirection[index],
            type === 'date',
          ),
        ),
        sortCursor,
        sortDirection,
        sortIndex: index,
      };
    });
  }
  updateHeader = (nextProps) => {
    const pageLength = this.getPageLength(nextProps.height);
    this.setState((prevState) => {
      return {
        pageData: this.getPageData(
          prevState.page,
          pageLength,
          nextProps.data.list,
        ),
        sortCursor: nextProps.data.header.map((column) => {
          return column.sort ? 'n-resize' : 'default';
        }),
        sortDirection: nextProps.data.header.map(() => {
          return 'desc';
        }),
        sortIndex: -1,
      };
    });
  }
  updateList = (nextProps, props) => {
    const pageLength = this.getPageLength(nextProps.height);
    const setPage = (prevPage, prevLength, newLength) => {
      if (newLength !== prevLength) {
        return 0;
      }
      return prevPage;
    };
    this.setState((prevState) => {
      return {
        page: setPage(prevState.page, props.data.list.length, nextProps.data.list.length),
        pageData: this.getPageData(
          prevState.page,
          pageLength,
          this.sortInputData(
            nextProps.data.list,
            prevState.sortIndex,
            prevState.sortIndex > -1 ? prevState.sortDirection[prevState.sortIndex] : null,
          ),
        ),
        pageLength,
        pageTotal: this.getPageTotal(pageLength, nextProps.data.list),
      };
    });
  }
  render() {
    return (
      <Table
        changePage={ this.changePage }
        footer={ this.props.footer }
        header={ this.props.data.header }
        headerStyle={ this.props.headerStyle }
        page={ this.state.page }
        pageData={ this.state.pageData }
        pageTotal={ this.state.pageTotal }
        sortCursor={ this.state.sortCursor }
        sortTable={ this.sortTable }
      />
    );
  }
}

TableContainer.defaultProps = {
  footer: {},
  headerStyle: {},
  reset: 0,
};

TableContainer.propTypes = {
  data: PropTypes.shape({
    header: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        sort: PropTypes.bool,
        type: PropTypes.string,
      }),
    ),
    key: PropTypes.number,
    list: PropTypes.arrayOf(
      PropTypes.shape({
        columns: PropTypes.arrayOf(
          PropTypes.shape({
            style: PropTypes.shape({}),
            type: PropTypes.string,
            value: PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.shape({}),
              PropTypes.string,
            ]),
          }),
        ),
        key: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      }),
    ),
  }).isRequired,
  footer: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({}),
  ]),
  height: PropTypes.number.isRequired,
  headerStyle: PropTypes.shape({}),
  reset: PropTypes.number,
};

export default TableContainer;
