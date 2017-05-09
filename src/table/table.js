import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './table.scss';

class CustomTable extends React.Component {
  render() {
    return (
      <Table>
        <TableHeader
          adjustForCheckbox={ false }
          displaySelectAll={ false }
        >
          <TableRow>
            { this.props.header.map((column, index) => {
              const buttonStyle = { cursor: this.props.sortCursor[index] };
              const onClickFunc = column.sort ?
                () => { this.props.sortTable(column.type); } :
                () => {}
              ;
              const style = column.style ? column.style : { textAlign: 'center' };
              return (
                <TableHeaderColumn
                  key={ column.name }
                  style={ style }
                >
                  <button
                    className="table-header-button"
                    onClick={ onClickFunc }
                    style={ buttonStyle }
                  >
                    { column.name }
                  </button>
                </TableHeaderColumn>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={ false }
        >
          { this.props.pageData.map((row) => {
            return (
              <TableRow
                key={ row.key }
              >
                { row.columns.map((column) => {
                  const style = column.style ? column.style : { textAlign: 'left' };
                  return (
                    <TableRowColumn
                      key={ row.key }
                      style={ style }
                    >
                      { column.value }
                    </TableRowColumn>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn
              colSpan={ this.props.header.length }
              style={ { textAlign: 'right' } }
            >
              { this.props.footer }
              { this.props.page > 0 &&
                <FlatButton
                  className="table-page-button"
                  icon={ <FontAwesome name="angle-left" /> }
                  onClick={ () => { this.props.changePage('down'); } }
                />
              }
              Page { this.props.page + 1 }/{ this.props.pageTotal + 1}
              { this.props.page < this.props.pageTotal &&
                <FlatButton
                  className="table-page-button"
                  icon={ <FontAwesome name="angle-right" /> }
                  onClick={ () => { this.props.changePage('up'); } }
                />
              }
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

CustomTable.defaultProps = {
  footer: {},
};

CustomTable.propTypes = {
  changePage: PropTypes.func.isRequired,
  footer: PropTypes.shape({}),
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sort: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageData: PropTypes.arrayOf(
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
  ).isRequired,
  pageTotal: PropTypes.number.isRequired,
  sortCursor: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  sortTable: PropTypes.func.isRequired,
};

export default CustomTable;
