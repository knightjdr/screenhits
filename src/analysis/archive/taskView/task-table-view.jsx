import ArrowDownIcon from 'material-ui/svg-icons/navigation/expand-more';
import ArrowFirstIcon from 'material-ui/svg-icons/navigation/first-page';
import ArrowLastIcon from 'material-ui/svg-icons/navigation/last-page';
import ArrowPageBackIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowPageForwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpIcon from 'material-ui/svg-icons/navigation/expand-less';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import TextField from 'material-ui/TextField';

import Tooltip from '../../../tooltip/tooltip-container';
import { viewTaskProp } from '../../../types';

const arrowContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};
const arrowIconStyle = {
  height: 30,
  width: 30,
  padding: 3,
};
const arrowPageIconStyle = {
  height: 20,
  width: 20,
};
const containerStyle = {
  alignItems: 'flex-end',
  display: 'flex',
  position: 'absolute',
};
const gridContainerStyle = {
  display: 'grid',
  gridColumn: 2,
  gridRow: 2,
};
const gridItemStyle = {
  height: 30,
  width: 30,
};
const headerContainerStyle = {
  backgroundColor: 'white',
  gridColumn: 2,
  gridRow: 1,
  position: 'relative',
};
const headerStyle = {
  backgroundColor: 'white',
  border: 'none',
  bottom: 0,
  display: 'inline-block',
  height: 24,
  lineHeight: '24px',
  margin: '3px 0px',
  overflow: 'hidden',
  padding: '0px 0px 0px 0px',
  position: 'absolute',
  textOverflow: 'ellipsis',
  transform: 'rotate(-90deg) translateY(100%)',
  transformOrigin: 'left bottom',
  whiteSpace: 'nowrap',
  ':focus': {
    outline: 0,
  },
};
const panelOptionsStyle = {
  backgroundColor: 'white',
  borderBottomRightRadius: 2,
  borderStyle: 'solid',
  borderWidth: '1px',
  padding: 5,
  width: 170,
};
const panelStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  left: -180,
  position: 'fixed',
  top: 70,
  transition: 'left 300ms linear',
  width: 205,
};
const panelTabStyle = {
  backgroundColor: 'white',
  borderStyle: 'solid',
  borderRadius: '0px 2px 2px 0px',
  borderWidth: '1px',
  marginLeft: -1,
};
const rangeInputHintStyle = {
  textAlign: 'center',
  width: 75,
};
const rangeInputStyle = {
  width: 75,
};
const rangeInputTextStyle = {
  textAlign: 'center',
};
const rowContainerStyle = {
  display: 'grid',
  gridColumn: 1,
  gridRow: 2,
  gridRowGap: 0,
};
const rowItemStyle = {
  margin: '3px 0px',
  height: 24,
  lineHeight: '24px',
  overflowX: 'hidden',
  textAlign: 'right',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};
const settingsFontStyle = {
  height: 18,
  width: 18,
  padding: 0,
};
const settingsIconStyle = {
  height: 24,
  width: 24,
  padding: 3,
};
const tableContainerStyle = {
  display: 'grid',
  gridColumnGap: 10,
};

class TaskTableView extends React.Component {
  checkOverflow = (e) => {
    const el = e.target;
    const isOverflowing = el.clientWidth < el.scrollWidth
      || el.clientHeight < el.scrollHeight
    ;
    return isOverflowing;
  }
  render() {
    return (
      <div
        style={ containerStyle }
      >
        <div
          style={ Object.assign(
            {},
            tableContainerStyle,
            this.props.style,
            {
              gridTemplateColumns: `${this.props.dimensions.rowNameWidth}px ${this.props.dimensions.headerWidth}px`,
              gridTemplateRows: `${this.props.dimensions.headerHeight}px ${this.props.dimensions.tableHeight}px`,
            }
          ) }
        >
          <div
            style={
              Object.assign(
                {},
                headerContainerStyle,
                {
                  height: this.props.dimensions.headerHeight,
                  width: this.props.dimensions.headerWidth,
                }
              )
            }
          >
            {
              this.props.task.header &&
              this.props.task.header.map((columnName, columnIndex) => {
                const keyName = `${columnName}-${columnIndex}`;
                return (
                  <button
                    key={ keyName }
                    onClick={ () => { this.props.sortRows(columnIndex); } }
                    onMouseEnter={ (e) => {
                      const doesOverflow = this.checkOverflow(e);
                      this.props.tooltip.showFunc(e, columnName, 'top', !doesOverflow);
                    } }
                    onMouseLeave={ this.props.tooltip.hideFunc }
                    style={ Object.assign(
                      {},
                      headerStyle,
                      {
                        cursor: this.props.trackSortHeader[columnIndex].direction < 0 ?
                          's-resize'
                          :
                          'n-resize',
                        width: this.props.dimensions.headerHeight,
                      }
                    ) }
                  >
                    { columnName }
                  </button>
                );
              })
            }
          </div>
          <div
            style={ rowContainerStyle }
          >
            {
              this.props.page &&
              this.props.page.map((row, rowIndex) => {
                const rowKeyName = `${row.name}-${rowIndex}`;
                return (
                  <div
                    key={ rowKeyName }
                    onMouseEnter={ (e) => {
                      const doesOverflow = this.checkOverflow(e);
                      this.props.tooltip.showFunc(e, row.name, 'top', !doesOverflow);
                    } }
                    onMouseLeave={ this.props.tooltip.hideFunc }
                    style={ Object.assign(
                      {},
                      rowItemStyle,
                      {
                        gridColumn: 1,
                        gridRow: rowIndex + 1,
                      }
                    ) }
                  >
                    { row.name }
                  </div>
                );
              })
            }
          </div>
          <div
            style={ gridContainerStyle }
          >
            {
              this.props.page &&
              this.props.page.map((row, rowIndex) => {
                return (
                  row.columns.map((column, columnIndex) => {
                    const gridKeyName = `${column.name}-${rowIndex}-columnIndex`;
                    return (
                      <div
                        onMouseEnter={ (e) => {
                          this.props.tooltip.showFunc(e, column.tooltip, 'top');
                        } }
                        onMouseLeave={ this.props.tooltip.hideFunc }
                        key={ gridKeyName }
                        style={ Object.assign(
                          {},
                          gridItemStyle,
                          {
                            backgroundColor: this.props.gridColor(
                              this.props.options.rangeMax,
                              this.props.options.rangeMin,
                              column.value
                            ),
                            gridColumn: columnIndex + 2,
                            gridRow: rowIndex + 1,
                          }
                        ) }
                      />
                    );
                  })
                );
              })
            }
          </div>
        </div>
        <div
          style={ arrowContainerStyle }
        >
          <IconButton
            onClick={ this.props.changeView.firstRow }
            style={ Object.assign(
              {},
              arrowIconStyle,
              {
                transform: 'rotate(90deg)',
              }
            ) }
          >
            <ArrowFirstIcon />
          </IconButton>
          <IconButton
            iconStyle={ arrowPageIconStyle }
            onClick={ this.props.changeView.pageBack }
            style={ arrowIconStyle }
          >
            <ArrowPageBackIcon />
          </IconButton>
          <IconButton
            onClick={ this.props.changeView.previousRow }
            style={ arrowIconStyle }
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            onClick={ this.props.changeView.nextRow }
            style={ arrowIconStyle }
          >
            <ArrowDownIcon />
          </IconButton>
          <IconButton
            iconStyle={ arrowPageIconStyle }
            onClick={ this.props.changeView.pageForward }
            style={ arrowIconStyle }
          >
            <ArrowPageForwardIcon />
          </IconButton>
          <IconButton
            onClick={ this.props.changeView.lastRow }
            style={ Object.assign(
              {},
              arrowIconStyle,
              {
                transform: 'rotate(90deg)',
              }
            ) }
          >
            <ArrowLastIcon />
          </IconButton>
        </div>
        <div
          style={ Object.assign(
            {},
            panelStyle,
            {
              left: this.props.panel.left,
            }
          ) }
        >
          <div
            style={ Object.assign(
              {},
              panelOptionsStyle,
              {
                borderColor: this.props.muiTheme.palette.primary1Color,
              }
            ) }
          >
            <Checkbox
              checked={ this.props.options.enableTooltips }
              label="Enable tooltips"
              onCheck={ () => {
                this.props.optionChange(
                  'enableTooltips',
                  !this.props.options.enableTooltips
                );
              } }
            />
            <TextField
              hintStyle={ rangeInputHintStyle }
              hintText="Min."
              inputStyle={ rangeInputTextStyle }
              onChange={ (e) => {
                this.props.rangeChange(
                  'rangeMin',
                  e.target.value
                );
              } }
              style={ rangeInputStyle }
              type="text"
              value={ this.props.options.rangeMinStr }
            />
          </div>
          <div
            style={ Object.assign(
              {},
              panelTabStyle,
              {
                borderColor: this.props.muiTheme.palette.primary1Color,
              }
            ) }
          >
            <IconButton
              iconStyle={ settingsFontStyle }
              onClick={ this.props.panel.toggle }
              style={ settingsIconStyle }
            >
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
        <Tooltip
          position={ this.props.tooltip.position }
          rect={ this.props.tooltip.rect }
          show={ this.props.tooltip.show }
          text={ this.props.tooltip.text }
          tooltipStyle={ {
            textAlign: 'left',
          } }
        />
      </div>
    );
  }
}


TaskTableView.propTypes = {
  changeView: PropTypes.shape({
    firstRow: PropTypes.func,
    lastRow: PropTypes.func,
    nextRow: PropTypes.func,
    pageBack: PropTypes.func,
    pageForward: PropTypes.func,
    previousRow: PropTypes.func,
  }).isRequired,
  dimensions: PropTypes.shape({
    headerHeight: PropTypes.number,
    headerWidth: PropTypes.number,
    rowNameWidth: PropTypes.number,
    tableHeight: PropTypes.number,
  }).isRequired,
  gridColor: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
  optionChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    enableTooltips: PropTypes.bool,
    rangeMax: PropTypes.number,
    rangeMin: PropTypes.number,
    rangeMinStr: PropTypes.string,
  }).isRequired,
  page: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  panel: PropTypes.shape({
    left: PropTypes.number,
    toggle: PropTypes.func,
  }).isRequired,
  rangeChange: PropTypes.func.isRequired,
  sortRows: PropTypes.func.isRequired,
  style: PropTypes.shape({}).isRequired,
  task: viewTaskProp.isRequired,
  tooltip: PropTypes.shape({
    hideFunc: PropTypes.func,
    position: PropTypes.string,
    rect: PropTypes.shape({
      bottom: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    text: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.string,
      ),
      PropTypes.string,
    ]),
  }).isRequired,
  trackSortHeader: PropTypes.arrayOf(
    PropTypes.shape({
      direction: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default muiThemeable()(Radium(TaskTableView));
