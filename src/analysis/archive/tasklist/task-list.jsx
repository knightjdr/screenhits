import PropTypes from 'prop-types';
import React from 'react';

import CustomTable from '../../../table/table-container';

class TaskList extends React.Component {
  list = () => {
    const tableList = this.props.tasks.map((task, index) => {
      const columns = this.props.header.map((header) => {
        return {
          type: header.type,
          value: task[header.type],
        };
      });
      // add options fields
      columns[columns.length - 1].value = <span>Options</span>;
      return {
        key: `taskList-${index}`,
        columns,
      };
    });
    return tableList;
  }
  render() {
    return (
      <div>
        <CustomTable
          data={ {
            header: this.props.header,
            list: this.list(),
          } }
          footer={ false }
          height={ this.props.tableHeight }
        />
      </div>
    );
  }
}

TaskList.propTypes = {
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  tableHeight: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default TaskList;
