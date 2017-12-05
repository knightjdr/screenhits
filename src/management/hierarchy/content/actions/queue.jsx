import PropTypes from 'prop-types';
import React from 'react';

import CustomTable from '../../../../table/table-container';

class Queue extends React.Component {
  list = () => {
    const tableList = this.props.queue.map((sample, index) => {
      const columns = this.props.header.map((header) => {
        return {
          type: header.type,
          value: sample[header.type],
        };
      });
      return {
        key: `${sample[this.props.keyName]}-${index}`,
        columns,
      };
    });
    return tableList;
  }
  render() {
    return (
      <CustomTable
        data={ {
          header: this.props.header,
          list: this.list(),
        } }
        footer={ false }
        height={ this.props.tableHeight }
      />
    );
  }
}


Queue.propTypes = {
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  keyName: PropTypes.string.isRequired,
  queue: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      sampleName: PropTypes.string,
      userName: PropTypes.string,
    }),
  ).isRequired,
  tableHeight: PropTypes.number.isRequired,
};

export default Queue;
