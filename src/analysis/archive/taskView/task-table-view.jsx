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
import ReactTooltip from 'react-tooltip';
import RestoreIcon from 'material-ui/svg-icons/action/restore';
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
  margin: '3px 0px',
  overflow: 'hidden',
  padding: '0px 0px 0px 0px',
  position: 'absolute',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  transform: 'rotate(-90deg) translateY(100%)',
  transformOrigin: 'left bottom',
  whiteSpace: 'nowrap',
  ':focus': {
    outline: 0,
  },
};
const legendGridStyle = {
  display: 'flex',
  padding: '0 5px',
};
const legendGridCellStyle = {
  height: 30,
  width: 2,
};
const optionFieldContainerStyle = {
  marginTop: 10,
};
const optionFieldStyle = {
  margin: '10px 0',
};
const optionFieldTextStyle = {
  marginLeft: 10,
};
const optionsInputStyle = {
  borderBottom: '1px solid rgba(0,0,0,0.15)',
  borderLeft: 'none',
  borderRight: 'none',
  borderTop: 'none',
  textAlign: 'center',
  width: 50,
  ':focus': {
    outline: 0,
  },
};
const panelOptionsStyle = {
  backgroundColor: 'white',
  borderBottomRightRadius: 2,
  borderStyle: 'solid',
  borderWidth: '1px',
  boxShadow: '2px 2px 2px 0px rgba(0,0,0,0.5)',
  padding: 10,
  width: 225,
};
const panelStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  left: -235,
  position: 'fixed',
  top: 70,
  transition: 'left 300ms linear',
  width: 260,
};
const panelTabStyle = {
  backgroundColor: 'white',
  borderStyle: 'solid',
  borderRadius: '0px 2px 2px 0px',
  borderWidth: '1px',
  boxShadow: '2px 2px 2px 0px rgba(0,0,0,0.5)',
  marginLeft: -1,
};
const rangeInputContainerStyle = {
  alignItems: 'flex-end',
  display: 'flex',
  justifyContent: 'space-between',
};
const rangeCenterHintStyle = {
  textAlign: 'center',
  width: 75,
};
const rangeInputStyle = {
  width: 75,
};
const centerInputTextStyle = {
  textAlign: 'center',
};
const rangeZeroStyle = {
  bottom: 13,
  position: 'relative',
};
const rowContainerStyle = {
  display: 'grid',
  gridColumn: 1,
  gridRow: 2,
  gridRowGap: 0,
};
const rowItemStyle = {
  margin: '3px 0px',
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
  padding: 5,
};
const tableContainerStyle = {
  display: 'grid',
  gridColumnGap: 5,
};

class TaskTableView extends React.Component {
  getFontSize = (height) => {
    if (height >= 30) {
      return 18;
    }
    return Math.floor(0.6 * height);
  }
  checkOverflow = (e) => {
    const el = e.target;
    const isOverflowing = el.clientWidth < el.scrollWidth
      || el.clientHeight < el.scrollHeight
    ;
    return isOverflowing;
  }
  render() {
    const currContainerStyle = this.props.centerView ?
      Object.assign(
        {},
        containerStyle,
        {
          left: '50%',
          transform: 'translate(-50%, 0)',
        }
      )
      :
      containerStyle
    ;
    const currHeaderStyle = Object.assign(
      {},
      headerStyle,
      {
        fontSize: this.getFontSize(this.props.gridHeight),
        height: this.props.gridHeight - 6,
        lineHeight: `${this.props.gridHeight - 6}px`,
      }
    );
    const gridItemStyle = {
      height: this.props.gridHeight,
      width: this.props.gridHeight,
    };
    const currRowItemStyle = Object.assign(
      {},
      rowItemStyle,
      {
        fontSize: this.getFontSize(this.props.gridHeight),
        height: this.props.gridHeight - 6,
        lineHeight: `${this.props.gridHeight - 6}px`,
      }
    );
    return (
      <div
        style={ { width: '100% ' } }
      >
        <div
          style={ currContainerStyle }
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
                        currHeaderStyle,
                        {
                          cursor: this.props.trackSortHeader[columnIndex].direction < 0 ?
                            's-resize'
                            :
                            'n-resize',
                          left: columnIndex * this.props.gridHeight,
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
                        currRowItemStyle,
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
                      const gridKeyName = `${column.name}-${rowIndex}-${columnIndex}`;
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
            <div
              style={ legendGridStyle }
            >
              {
                this.props.colorRange.map((color, colorIndex) => {
                  const legendKey = `legendKey-${colorIndex}`;
                  return (
                    <div
                      key={ legendKey }
                      style={ Object.assign(
                        {},
                        legendGridCellStyle,
                        {
                          backgroundColor: color,
                        }
                      ) }
                    />
                  );
                })
              }
            </div>
            <div
              style={ rangeInputContainerStyle }
            >
              <TextField
                hintStyle={ rangeCenterHintStyle }
                hintText="Min."
                inputStyle={ centerInputTextStyle }
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
              <div
                style={ rangeZeroStyle }
              >
                0
              </div>
              <TextField
                hintStyle={ rangeCenterHintStyle }
                hintText="Max."
                inputStyle={ centerInputTextStyle }
                onChange={ (e) => {
                  this.props.rangeChange(
                    'rangeMax',
                    e.target.value
                  );
                } }
                style={ rangeInputStyle }
                type="text"
                value={ this.props.options.rangeMaxStr }
              />
            </div>
            <div
              style={ optionFieldContainerStyle }
            >
              Options
              <Checkbox
                checked={ this.props.options.enableTooltips }
                label="Enable tooltips"
                labelStyle={ { marginLeft: 22 } }
                onCheck={ () => {
                  this.props.optionChange(
                    'enableTooltips',
                    !this.props.options.enableTooltips
                  );
                } }
                style={ optionFieldStyle }
              />
              <div>
                <input
                  onChange={ (e) => { this.props.changeGridHeight(e.target.value); } }
                  onKeyPress={ (e) => {
                    if (e.key === 'Enter') {
                      this.props.updateGridHeight();
                    }
                  } }
                  style={ optionsInputStyle }
                  type="number"
                  value={ this.props.gridHeightInput }
                />
                <span
                  style={ optionFieldTextStyle }
                >
                  Cell height/width (px)
                </span>
              </div>
            </div>
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
              data-tip={ true }
              data-for={ 'toggle-viz-panel' }
              iconStyle={ settingsFontStyle }
              onClick={ this.props.panel.toggle }
              style={ settingsIconStyle }
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              data-tip={ true }
              data-for={ 'reset-viz-view' }
              iconStyle={ settingsFontStyle }
              onClick={ this.props.resetView }
              style={ settingsIconStyle }
            >
              <RestoreIcon />
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
        <ReactTooltip
          effect="solid"
          id="toggle-viz-panel"
          type="dark"
          place="top"
        >
          { this.props.panel.left < -1 ? 'Show' : 'Hide' } settings panel
        </ReactTooltip>
        <ReactTooltip
          effect="solid"
          id="reset-viz-view"
          type="dark"
          place="top"
        >
          Reset view
        </ReactTooltip>
      </div>
    );
  }
}


TaskTableView.propTypes = {
  centerView: PropTypes.bool.isRequired,
  changeGridHeight: PropTypes.func.isRequired,
  changeView: PropTypes.shape({
    firstRow: PropTypes.func,
    lastRow: PropTypes.func,
    nextRow: PropTypes.func,
    pageBack: PropTypes.func,
    pageForward: PropTypes.func,
    previousRow: PropTypes.func,
  }).isRequired,
  colorRange: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  dimensions: PropTypes.shape({
    headerHeight: PropTypes.number,
    headerWidth: PropTypes.number,
    rowNameWidth: PropTypes.number,
    tableHeight: PropTypes.number,
  }).isRequired,
  gridColor: PropTypes.func.isRequired,
  gridHeight: PropTypes.number.isRequired,
  gridHeightInput: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
  optionChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    enableTooltips: PropTypes.bool,
    rangeMax: PropTypes.number,
    rangeMaxStr: PropTypes.string,
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
  resetView: PropTypes.func.isRequired,
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
  updateGridHeight: PropTypes.func.isRequired,
};

export default muiThemeable()(Radium(TaskTableView));
