import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import Rainbow from 'rainbowvis.js';
import React from 'react';

import TaskTableView from './task-table-view';
import { viewTaskProp } from '../../../types';

let canvas;
const defaultGridHeight = 20;
const numberOfColors = 100;
const emptyRect = {
  bottom: null,
  height: null,
  left: null,
  right: null,
  top: null,
  width: null,
  x: null,
  y: null,
};

// styles

const defaults = {
  headerHeight: 100,
  family: 'sans-serif',
  padding: 5,
  size: '18px',
};

class TaskTableViewContainer extends React.Component {
  constructor(props) {
    super(props);
    canvas = document.createElement('canvas');
    const headerHeight = this.getHeaderHeight(this.props.task.header);
    const headerWidth = this.getHeaderWidth(this.props.task.header, defaultGridHeight);
    const numRows = this.calculateRows(headerHeight, defaultGridHeight);
    const tableHeight = this.getTableHeight(numRows, defaultGridHeight);
    this.state = {
      centerView: this.checkWidth(headerWidth),
      colorRange: this.initRainbow(),
      data: this.props.task.results ? JSON.parse(JSON.stringify(this.props.task.results)) : [],
      gridHeight: defaultGridHeight,
      gridHeightInput: defaultGridHeight,
      headerHeight,
      headerWidth,
      numRows,
      options: {
        enableTooltips: false,
        rangeMax: this.props.task.range ? this.props.task.range.max : 0,
        rangeMaxStr: this.props.task.range ? String(this.props.task.range.max) : String(0),
        rangeMin: this.props.task.range ? this.props.task.range.min : 0,
        rangeMinStr: this.props.task.range ? String(this.props.task.range.min) : String(0),
      },
      page: this.subsetData(this.props.task.results, 0, numRows),
      panel: {
        left: -1,
      },
      rowNameWidth: 100,
      tableHeight,
      tooltip: {
        position: 'top',
        rect: emptyRect,
        show: false,
        text: '',
      },
      trackSortHeader: this.setSortHeader(this.props.task.header),
      viewRows: {
        start: 0,
        end: numRows - 1,
      },
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { task } = nextProps;
    if (!deepEqual(task.header, this.props.task.header)) {
      this.setState({
        headerHeight: this.getHeaderHeight(task.header),
        headerWidth: this.getHeaderWidth(task.header),
      });
    }
  }
  getHeaderHeight = (header, headerStyle = {}) => {
    if (header) {
      const context = canvas.getContext('2d');
      const font = headerStyle.fontFamily ? headerStyle.fontFamily : defaults.family;
      const fontSize = headerStyle.fontSize ? headerStyle.fontSize : defaults.size;
      context.font = `${fontSize} ${font}`;
      let width = 0;
      header.forEach((text) => {
        const currWidth = context.measureText(text).width;
        if (currWidth > width) {
          width = currWidth;
        }
      });
      const desiredHeight = Math.ceil(width);
      return desiredHeight < defaults.headerHeight ? desiredHeight : defaults.headerHeight;
    }
    return defaults.headerHeight;
  }
  getHeaderWidth = (header, gridHeight) => {
    if (header) {
      const numColumns = header.length;
      return numColumns * gridHeight;
    }
    return 0;
  }
  getTableHeight = (numRows, gridHeight) => {
    return numRows * gridHeight;
  }
  setSortHeader = (header) => {
    if (
      header &&
      header.length > 0
    ) {
      return header.map((name) => {
        return {
          direction: -1,
          name,
        };
      });
    }
    return [];
  }
  calculateRows = (headerHeight, gridHeight) => {
    const parentHeight = Math.floor(window.innerHeight) - 100;
    return Math.floor((parentHeight - headerHeight) / gridHeight);
  }
  changeGridHeight = (height) => {
    if (
      !height ||
      (!isNaN(height) &&
      Number(height) >= 1)
    ) {
      this.setState({
        gridHeightInput: Math.ceil(Number(height)),
      });
    }
  }
  checkWidth = (headerWidth) => {
    // 100 for row labels, 5 for column gap, 30 for nav buttons
    const imageWidth = headerWidth + 135;
    if (imageWidth < window.innerWidth - 20) { // 20 padding
      return true;
    }
    return false;
  }
  firstRow = () => {
    this.setState(({ data, numRows }) => {
      const newViewRows = {
        start: 0,
        end: numRows - 1,
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  gridColor = (max, min, value) => {
    const mappedNumber = this.mapNumber(
      {
        max,
        min,
      },
      value
    );
    const gridNumber = Math.floor(((mappedNumber + 1) / 2) * 100);
    return this.state.colorRange[gridNumber];
  }
  hideTooltip = () => {
    this.setState({
      tooltip: {
        position: 'top',
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
  initRainbow = () => {
    const rainbow = new Rainbow();
    rainbow.setNumberRange(0, numberOfColors);
    rainbow.setSpectrum(
      '#2196f3',
      '#ffffff',
      '#f44336'
    );
    return [...Array(numberOfColors + 1).keys()].map((value) => {
      return `#${rainbow.colorAt(value)}`;
    });
  }
  lastRow = () => {
    this.setState(({ data, numRows }) => {
      const end = data.length - 1;
      const newViewRows = {
        start: end - (numRows - 1),
        end,
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  mapNumber = (range, value) => {
    if (value > 0) {
      const fraction = value / range.max;
      return fraction <= 1 ? fraction : 1;
    } else if (
      value === 0 ||
      isNaN(value)
    ) {
      return 0;
    }
    const fraction = -value / range.min;
    return fraction >= -1 ? fraction : -1;
  }
  nextRow = () => {
    this.setState(({ data, numRows, viewRows }) => {
      const end = viewRows.end + 1 > data.length - 1 ?
        viewRows.end
        :
        viewRows.end + 1
      ;
      const newViewRows = {
        start: end - (numRows - 1),
        end,
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  optionChange = (key, value) => {
    this.setState(({ options }) => {
      const newOptions = Object.assign({}, options);
      newOptions[key] = value;
      return {
        options: newOptions,
      };
    });
  }
  pageBack = () => {
    this.setState(({ data, numRows, viewRows }) => {
      const start = viewRows.start - numRows < 0 ?
        0
        :
        viewRows.start - numRows
      ;
      const newViewRows = {
        start,
        end: start + (numRows - 1),
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  pageForward = () => {
    this.setState(({ data, numRows, viewRows }) => {
      const totalRows = data.length - 1;
      const end = viewRows.end + numRows > totalRows ?
        totalRows
        :
        viewRows.end + numRows
      ;
      const newViewRows = {
        start: end - (numRows - 1),
        end,
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  previousRow = () => {
    this.setState(({ data, numRows, viewRows }) => {
      const start = viewRows.start - 1 < 0 ?
        0
        :
        viewRows.start - 1
      ;
      const newViewRows = {
        start,
        end: start + (numRows - 1),
      };
      return {
        page: this.subsetData(data, newViewRows.start, newViewRows.end + 1),
        viewRows: newViewRows,
      };
    });
  }
  rangeChange = (key, value) => {
    this.setState(({ options }) => {
      const newOptions = Object.assign({}, options);
      if (isNaN(value)) {
        newOptions[`${key}Str`] = value;
      } else {
        newOptions[key] = Number(value);
        newOptions[`${key}Str`] = value;
      }
      return {
        options: newOptions,
      };
    });
  }
  resetView = () => {
    this.setState(({ headerHeight }) => {
      const headerWidth = this.getHeaderWidth(this.props.task.header, defaultGridHeight);
      const numRows = this.calculateRows(headerHeight, defaultGridHeight);
      const tableHeight = this.getTableHeight(numRows, defaultGridHeight);
      return {
        data: this.props.task.results ? JSON.parse(JSON.stringify(this.props.task.results)) : [],
        gridHeight: defaultGridHeight,
        gridHeightInput: defaultGridHeight,
        headerWidth,
        numRows,
        options: {
          enableTooltips: false,
          rangeMax: this.props.task.range ? this.props.task.range.max : 0,
          rangeMaxStr: this.props.task.range ? String(this.props.task.range.max) : String(0),
          rangeMin: this.props.task.range ? this.props.task.range.min : 0,
          rangeMinStr: this.props.task.range ? String(this.props.task.range.min) : String(0),
        },
        page: this.subsetData(this.props.task.results, 0, numRows),
        tableHeight,
        trackSortHeader: this.setSortHeader(this.props.task.header),
        viewRows: {
          start: 0,
          end: numRows - 1,
        },
      };
    });
  }
  showTooltip = (e, content, position, disable = false) => {
    if (
      this.state.options.enableTooltips &&
      !disable
    ) {
      const domRect = e.target.getBoundingClientRect();
      const rect = {
        bottom: domRect.bottom,
        height: domRect.height,
        left: domRect.left,
        right: domRect.right,
        top: domRect.top,
        width: domRect.width,
        x: domRect.x,
        y: domRect.y,
      };
      const tooltipText = [];
      if (typeof content === 'object') {
        Object.keys(content).sort().forEach((field) => {
          const str = `${field}: ${content[field]}`;
          tooltipText.push(str);
        });
      } else {
        tooltipText.push(String(content));
      }
      this.setState({
        tooltip: {
          position,
          rect,
          show: true,
          text: tooltipText,
        },
      });
    }
  }
  sortRows = (columnIndex) => {
    // compare strings
    const compareStrings = (a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    };
    this.setState(({ data, numRows, trackSortHeader }) => {
      const direction = trackSortHeader[columnIndex].direction;
      const sortedData = JSON.parse(JSON.stringify(data));
      const newTrackSortHeader = JSON.parse(JSON.stringify(trackSortHeader));
      newTrackSortHeader[columnIndex].direction *= -1;
      // sort by value, or by name if value is the same
      sortedData.sort((a, b) => {
        const valueA = a.columns[columnIndex].value;
        const valueB = b.columns[columnIndex].value;
        if (
          !isNaN(valueA) &&
          !isNaN(valueB)
        ) {
          const diff = direction * (valueA - valueB);
          if (diff === 0) {
            return direction * compareStrings(a.name, b.name);
          }
          return direction * (valueA - valueB);
        } else if (
          isNaN(valueA) &&
          isNaN(valueB)
        ) {
          return direction * compareStrings(a.name, b.name);
        } else if (isNaN(valueA)) {
          return direction * (-1);
        } else if (isNaN(valueB)) {
          return direction * (1);
        }
        return direction * compareStrings(a.name, b.name);
      });
      return {
        data: sortedData,
        page: this.subsetData(sortedData, 0, numRows),
        trackSortHeader: newTrackSortHeader,
        viewRows: {
          start: 0,
          end: numRows - 1,
        },
      };
    });
  }
  subsetData = (data, start, end) => {
    if (data) {
      return data.slice(start, end);
    }
    return [];
  }
  togglePanel = () => {
    this.setState(({ panel }) => {
      const left = panel.left === -1 ? -237 : -1;
      return {
        panel: Object.assign(
          {},
          panel,
          {
            left,
          }
        ),
      };
    });
  }
  updateGridHeight = () => {
    this.setState(({ data, gridHeight, headerHeight, gridHeightInput }) => {
      if (
        !isNaN(gridHeightInput) &&
        gridHeightInput >= 1
      ) {
        const newGridHeight = Number(gridHeightInput);
        const headerWidth = this.getHeaderWidth(this.props.task.header, newGridHeight);
        const numRows = this.calculateRows(headerHeight, newGridHeight);
        const tableHeight = this.getTableHeight(numRows, newGridHeight);
        return {
          gridHeight: newGridHeight,
          headerWidth,
          numRows,
          page: this.subsetData(data, 0, numRows),
          tableHeight,
          viewRows: {
            start: 0,
            end: numRows - 1,
          },
        };
      }
      return {
        gridHeightInput: gridHeight,
      };
    });
  }
  render() {
    return (
      <TaskTableView
        centerView={ this.state.centerView }
        changeGridHeight={ this.changeGridHeight }
        changeView={ {
          firstRow: this.firstRow,
          lastRow: this.lastRow,
          nextRow: this.nextRow,
          pageBack: this.pageBack,
          pageForward: this.pageForward,
          previousRow: this.previousRow,
        } }
        colorRange={ this.state.colorRange }
        dimensions={ {
          headerHeight: this.state.headerHeight,
          headerWidth: this.state.headerWidth,
          rowNameWidth: this.state.rowNameWidth,
          tableHeight: this.state.tableHeight,
        } }
        gridColor={ this.gridColor }
        gridHeight={ this.state.gridHeight }
        gridHeightInput={ this.state.gridHeightInput }
        optionChange={ this.optionChange }
        options={ this.state.options }
        page={ this.state.page }
        panel={ Object.assign(
          {},
          this.state.panel,
          {
            toggle: this.togglePanel,
          }
        ) }
        rangeChange={ this.rangeChange }
        resetView={ this.resetView }
        sortRows={ this.sortRows }
        style={ this.props.style }
        task={ this.props.task }
        tooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            hideFunc: this.hideTooltip,
            showFunc: this.showTooltip,
          }
        ) }
        trackSortHeader={ this.state.trackSortHeader }
        updateGridHeight={ this.updateGridHeight }
      />
    );
  }
}

TaskTableViewContainer.defaultProps = {
  style: {},
};

TaskTableViewContainer.propTypes = {
  style: PropTypes.shape({}),
  task: viewTaskProp.isRequired,
};

export default TaskTableViewContainer;
