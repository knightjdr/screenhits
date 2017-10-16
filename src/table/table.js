import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
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

const pageButtonStyle = {
  fontSize: 20,
  height: 25,
  lineHeight: '12px',
  margin: '0px 5px 0px 5px',
  minWidth: 25,
  width: 25,
};

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
              const onClickFunc = column.sort ?
                () => { this.props.sortTable(index); } :
                () => {}
              ;
              const style = column.style ? column.style : { textAlign: 'center' };
              return (
                <TableHeaderColumn
                  key={ column.name }
                  style={ style }
                >
                  <button
                    key={ column.name }
                    onClick={ onClickFunc }
                    style={ {
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: this.props.sortCursor[index],
                      ':focus': {
                        outline: 0,
                      },
                      height: 50,
                      width: '100%',
                    } }
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
              { this.props.pageTotal > 0 &&
                <span>
                  { this.props.page > 0 &&
                    <FlatButton
                      icon={ <FontAwesome name="angle-left" /> }
                      onClick={ () => { this.props.changePage('down'); } }
                      style={ Object.assign(
                        {},
                        pageButtonStyle,
                        {
                          backgroundColor: this.props.muiTheme.palette.offWhite,
                          border: `1px solid ${this.props.muiTheme.palette.primary2Color}`,
                        },
                      ) }
                    />
                  }
                  Page { this.props.page + 1 }/{ this.props.pageTotal + 1}
                  { this.props.page < this.props.pageTotal &&
                    <FlatButton
                      icon={ <FontAwesome name="angle-right" /> }
                      onClick={ () => { this.props.changePage('up'); } }
                      style={ Object.assign(
                        {},
                        pageButtonStyle,
                        {
                          backgroundColor: this.props.muiTheme.palette.offWhite,
                          border: `1px solid ${this.props.muiTheme.palette.primary2Color}`,
                        },
                      ) }
                    />
                  }
                </span>
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
  footer: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({}),
  ]),
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sort: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      offWhite: PropTypes.string,
      primary2Color: PropTypes.string,
    }),
  }).isRequired,
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

export default Radium(muiThemeable()(CustomTable));
