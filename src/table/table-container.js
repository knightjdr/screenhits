// import FontAwesome from 'react-fontawesome';
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
        return column.sort ? 'n-resize' : 'not-allowed';
      }),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.height !== this.props.height) {
      const pageLength = this.getPageLength(this.props.height);
      if (pageLength !== this.state.pageLength) {
        let page = this.state.page;
        if ((page * pageLength) >= nextProps.data.list.length) {
          page -= 1;
        }
        this.setState({
          page,
          pageData: this.getPageData(page, pageLength, nextProps.data.list),
          pageLength,
          pageTotal: this.getPageTotal(pageLength, nextProps.data.list),
        });
      }
    } else {
      const pageLength = this.getPageLength(nextProps.height);
      this.setState({
        page: 0,
        pageData: this.getPageData(0, pageLength, nextProps.data.list),
        pageLength,
        pageTotal: this.getPageTotal(pageLength, nextProps.data.list),
      });
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
  changePage = (direction) => {
    this.setState((prevState) => {
      const newPage = direction === 'down' ? prevState.page - 1 : prevState.page + 1;
      return {
        page: newPage,
        pageData: this.props.data.list.slice(
          newPage * prevState.pageLength,
          (newPage * prevState.pageLength) + prevState.pageLength)
        ,
      };
    });
  }
  sortTable = (type) => {
    console.log(type);
  }
  render() {
    return (
      <Table
        changePage={ this.changePage }
        footer={ this.props.footer }
        header={ this.props.data.header }
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
  footer: PropTypes.shape({}),
  height: PropTypes.number.isRequired,
};

export default TableContainer;
