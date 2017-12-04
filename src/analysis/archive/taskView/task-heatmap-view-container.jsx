import PropTypes from 'prop-types';
import Rainbow from 'rainbowvis.js';
import React from 'react';

import TaskHeatmapView from './task-heatmap-view';
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
  fontSize: '12px',
  padding: 5,
};

class TaskHeatmapViewContainer extends React.Component {
  constructor(props) {
    super(props);
    canvas = document.createElement('canvas');
    // calculate number of columns that can fit in viewport
    const numCols = this.calculateCols(this.props.task.header, defaultGridHeight);
    const tableWidth = this.getTableWidth(numCols, defaultGridHeight);
    // calculate header size and number of rows that can fit in viewport
    const headerHeight = this.getHeaderHeight(this.props.task.header);
    const numRows = this.calculateRows(headerHeight, defaultGridHeight);
    const tableHeight = this.getTableHeight(numRows, defaultGridHeight);
    // set range
    const range = this.setRange(this.props.task.range);
    this.state = {
      centerView: this.checkWidth(tableWidth),
      colorRange: this.initRainbow(range),
      data: this.props.task.results ? JSON.parse(JSON.stringify(this.props.task.results)) : [],
      fontSize: defaults.fontSize,
      gridHeight: defaultGridHeight,
      gridHeightInput: defaultGridHeight,
      header: Object.assign([], this.props.task.header),
      headerHeight,
      highlightRow: '',
      numCols,
      numRows,
      options: {
        enableTooltips: false,
        gene: '',
        rangeMax: range.max,
        rangeMaxStr: String(range.max),
        rangeMin: range.min,
        rangeMinStr: String(range.min),
      },
      page: this.subsetData(
        this.props.task.results,
        {
          start: 0,
          end: numRows,
        },
        {
          start: 0,
          end: numCols,
        }
      ),
      pageHeader: this.setHeader(this.props.task.header, 0, numCols),
      panel: {
        left: -237,
      },
      rangeType: range.type,
      rowNameWidth: 100,
      searchError: '',
      tableHeight,
      tableWidth,
      tooltip: {
        position: 'top',
        rect: emptyRect,
        show: false,
        text: '',
      },
      trackSortHeader: this.setSortHeader(this.props.task.header),
      viewCols: {
        start: 0,
        end: numCols - 1,
      },
      viewRows: {
        start: 0,
        end: numRows - 1,
      },
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getFontSize = (height) => {
    if (height >= 30) {
      return '18px';
    }
    return `${Math.floor(0.6 * height)}px`;
  }
  getHeaderHeight = (header, headerStyle = {}) => {
    if (header) {
      const context = canvas.getContext('2d');
      const font = headerStyle.fontFamily ? headerStyle.fontFamily : defaults.family;
      const fontSize = headerStyle.fontSize ? headerStyle.fontSize : defaults.fontSize;
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
  getTableHeight = (numRows, gridHeight) => {
    return numRows * gridHeight;
  }
  getTableWidth = (numCols, gridWidth) => {
    return numCols * gridWidth;
  }
  setHeader = (header, start, end) => {
    if (header) {
      return header.slice(start, end);
    }
    return [];
  }
  setRange = (range) => {
    const max = range.max > 0 ? range.max : 0;
    const min = range.min < 0 ? range.min : 0;
    let type = 'two-color';
    if (min === 0) {
      type = 'pos-single-color';
    } else if (max === 0) {
      type = 'neg-single-color';
    }
    return {
      max,
      min,
      type,
    };
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
  calculateCols = (header, gridWidth) => {
    if (header) {
      // 155 = 100 for row names, 5 for column gap, 30 for nav buttons, 20 padding
      const availableCols = Math.floor((window.innerWidth - 155) / gridWidth);
      return header.length < availableCols ?
        header.length
        :
        availableCols
      ;
    }
    return 0;
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
  checkWidth = (tableWidth) => {
    // 100 for row labels, 5 for column gap, 30 for nav buttons, 20 padding
    const imageWidth = tableWidth + 155;
    if (imageWidth < window.innerWidth) { // 20 padding
      return true;
    }
    return false;
  }
  clearSearch = () => {
    this.setState(({ options }) => {
      return {
        options: Object.assign(
          {},
          options,
          {
            gene: '',
          }
        ),
        highlightRow: '',
        searchError: '',
      };
    });
  }
  colBack = () => {
    this.setState(({ data, header, numCols, viewCols, viewRows }) => {
      const start = viewCols.start - numCols < 0 ?
        0
        :
        viewCols.start - numCols
      ;
      const newViewCols = {
        start,
        end: start + (numCols - 1),
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          }
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  colForward = () => {
    this.setState(({ data, header, numCols, viewCols, viewRows }) => {
      const totalCols = data[0].columns.length - 1;
      const end = viewCols.end + numCols > totalCols ?
        totalCols
        :
        viewCols.end + numCols
      ;
      const newViewCols = {
        start: end - (numCols - 1),
        end,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          }
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  firstCol = () => {
    this.setState(({ data, header, numCols, viewRows }) => {
      const newViewCols = {
        start: 0,
        end: numCols - 1,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          }
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  firstRow = () => {
    this.setState(({ data, numRows, viewCols }) => {
      const newViewRows = {
        start: 0,
        end: numRows - 1,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
        viewRows: newViewRows,
      };
    });
  }
  geneSearch = (gene) => {
    this.setState(({ data, numRows, viewCols }) => {
      const geneIndex = data.findIndex((row) => {
        return row.name.toLowerCase() === gene;
      });
      if (geneIndex > -1) {
        let newViewRows;
        const halfNoRows = Math.ceil(numRows / 2) - 1;
        if (geneIndex - halfNoRows < 0) {
          newViewRows = {
            start: 0,
            end: numRows - 1,
          };
        } else if (geneIndex + halfNoRows > data.length - 1) {
          newViewRows = {
            start: (data.length - 1) - (numRows - 1),
            end: data.length - 1,
          };
        } else {
          const start = geneIndex - halfNoRows;
          newViewRows = {
            start,
            end: start + (numRows - 1),
          };
        }
        return {
          highlightRow: gene.toLowerCase(),
          page: this.subsetData(
            data,
            {
              start: newViewRows.start,
              end: newViewRows.end + 1,
            },
            {
              start: viewCols.start,
              end: viewCols.end + 1,
            }
          ),
          searchError: '',
          viewRows: newViewRows,
        };
      }
      return {
        highlightRow: '',
        searchError: 'Gene not found',
      };
    });
  }
  gridMonoColor = (value) => {
    const mappedNumber = this.mapMonoNumber(value);
    const gridNumber = Math.floor(mappedNumber * 100);
    return this.state.colorRange[gridNumber];
  }
  gridTwoColor = (value) => {
    const mappedNumber = this.mapTwoNumber(value);
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
  initRainbow = (range) => {
    const rainbow = new Rainbow();
    rainbow.setNumberRange(0, numberOfColors);
    if (range.type === 'pos-single-color') {
      rainbow.setSpectrum(
        '#ffffff',
        '#f44336'
      );
    } else if (range.type === 'neg-single-color') {
      rainbow.setSpectrum(
        '#2196f3',
        '#ffffff',
      );
    } else {
      rainbow.setSpectrum(
        '#2196f3',
        '#ffffff',
        '#f44336'
      );
    }
    return [...Array(numberOfColors + 1).keys()].map((value) => {
      return `#${rainbow.colorAt(value)}`;
    });
  }
  lastCol = () => {
    this.setState(({ data, header, numCols, viewRows }) => {
      const end = data[0].columns.length - 1;
      const newViewCols = {
        start: end - (numCols - 1),
        end,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          }
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  lastRow = () => {
    this.setState(({ data, numRows, viewCols }) => {
      const end = data.length - 1;
      const newViewRows = {
        start: end - (numRows - 1),
        end,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
        viewRows: newViewRows,
      };
    });
  }
  mapMonoNumber = (value) => {
    const range = {
      max: this.state.options.rangeMax,
      min: this.state.options.rangeMin,
    };
    if (value <= range.min) {
      return 0;
    } else if (value >= range.max) {
      return 1;
    }
    return (value - range.min) / (range.max - range.min);
  }
  mapTwoNumber = (value) => {
    const range = {
      max: this.state.options.rangeMax,
      min: this.state.options.rangeMin,
    };
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
  nextCol = () => {
    this.setState(({ data, header, numCols, viewCols, viewRows }) => {
      const end = viewCols.end + 1 > data[0].columns.length - 1 ?
        viewCols.end
        :
        viewCols.end + 1
      ;
      const newViewCols = {
        start: end - (numCols - 1),
        end,
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          },
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  nextRow = () => {
    this.setState(({ data, numRows, viewCols, viewRows }) => {
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
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
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
    this.setState(({ data, numRows, viewCols, viewRows }) => {
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
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
        viewRows: newViewRows,
      };
    });
  }
  pageForward = () => {
    this.setState(({ data, numRows, viewCols, viewRows }) => {
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
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
        viewRows: newViewRows,
      };
    });
  }
  previousCol = () => {
    this.setState(({ data, header, numCols, viewCols, viewRows }) => {
      const start = viewCols.start - 1 < 0 ?
        0
        :
        viewCols.start - 1
      ;
      const newViewCols = {
        start,
        end: start + (numCols - 1),
      };
      return {
        page: this.subsetData(
          data,
          {
            start: viewRows.start,
            end: viewRows.end + 1,
          },
          {
            start: newViewCols.start,
            end: newViewCols.end + 1,
          }
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end + 1),
        viewCols: newViewCols,
      };
    });
  }
  previousRow = () => {
    this.setState(({ data, numRows, viewCols, viewRows }) => {
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
        page: this.subsetData(
          data,
          {
            start: newViewRows.start,
            end: newViewRows.end + 1,
          },
          {
            start: viewCols.start,
            end: viewCols.end + 1,
          }
        ),
        viewRows: newViewRows,
      };
    });
  }
  rangeChange = (key, value) => {
    this.setState(({ options, rangeType }) => {
      if ( // if 'value' is a number
        !isNaN(value) &&
        (
          rangeType !== 'two-color' ||
          (
            rangeType === 'two-color' && // min and max have restricted values for two-color plots
            (
              (key === 'rangeMin' && Number(value) < 0) ||
              (key === 'rangeMax' && Number(value) > 0)
            )
          )
        )
      ) {
        const newOptions = Object.assign({}, options);
        newOptions[key] = Number(value);
        newOptions[`${key}Str`] = value;
        return {
          options: newOptions,
        };
      } else if (!value) {
        const newOptions = Object.assign({}, options);
        newOptions[`${key}Str`] = value;
        return {
          options: newOptions,
        };
      } else if (
        value === '-' &&
        (
          rangeType !== 'two-color' ||
          key === 'rangeMin'
        )
      ) {
        const newOptions = Object.assign({}, options);
        newOptions[`${key}Str`] = value;
        return {
          options: newOptions,
        };
      }
      return {};
    });
  }
  resetView = () => {
    this.setState(({ headerHeight }) => {
      const numCols = this.calculateCols(this.props.task.header, defaultGridHeight);
      const tableWidth = numCols * defaultGridHeight;
      const numRows = this.calculateRows(headerHeight, defaultGridHeight);
      const tableHeight = this.getTableHeight(numRows, defaultGridHeight);
      return {
        data: this.props.task.results ? JSON.parse(JSON.stringify(this.props.task.results)) : [],
        gridHeight: defaultGridHeight,
        gridHeightInput: defaultGridHeight,
        numCols,
        numRows,
        options: {
          enableTooltips: false,
          gene: '',
          rangeMax: this.props.task.range ? this.props.task.range.max : 0,
          rangeMaxStr: this.props.task.range ? String(this.props.task.range.max) : String(0),
          rangeMin: this.props.task.range ? this.props.task.range.min : 0,
          rangeMinStr: this.props.task.range ? String(this.props.task.range.min) : String(0),
        },
        page: this.subsetData(
          this.props.task.results,
          {
            start: 0,
            end: numRows,
          },
          {
            start: 0,
            end: numCols,
          }
        ),
        tableHeight,
        tableWidth,
        trackSortHeader: this.setSortHeader(this.props.task.header),
        viewRows: {
          start: 0,
          end: numRows - 1,
        },
      };
    });
  }
  resize = () => {
    this.setState(({ data, gridHeight, header, viewCols, viewRows }) => {
      const numCols = this.calculateCols(header, gridHeight);
      const tableWidth = this.getTableWidth(numCols, gridHeight);
      const newViewCols = {
        start: viewCols.start,
        end: viewCols.start + numCols,
      };
      // calculate header size and number of rows that can fit in viewport
      const headerHeight = this.getHeaderHeight(header);
      const numRows = this.calculateRows(headerHeight, gridHeight);
      const tableHeight = this.getTableHeight(numRows, gridHeight);
      const newViewRows = {
        start: viewRows.start,
        end: viewRows.start + numRows,
      };
      return {
        centerView: this.checkWidth(tableWidth),
        headerHeight,
        numCols,
        numRows,
        page: this.subsetData(
          data,
          viewRows,
          newViewCols
        ),
        pageHeader: this.setHeader(header, newViewCols.start, newViewCols.end),
        tableHeight,
        tableWidth,
        viewCols: newViewCols,
        viewRows: newViewRows,
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
    this.setState(({ data, numCols, numRows, trackSortHeader }) => {
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
        page: this.subsetData(
          sortedData,
          {
            start: 0,
            end: numRows,
          },
          {
            start: 0,
            end: numCols,
          }
        ),
        trackSortHeader: newTrackSortHeader,
        viewRows: {
          start: 0,
          end: numRows - 1,
        },
      };
    });
  }
  subsetData = (data, row, col) => {
    if (data) {
      const newRows = data.slice(row.start, row.end);
      return newRows.map((currRow) => {
        return {
          name: currRow.name,
          columns: currRow.columns.slice(col.start, col.end),
        };
      });
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
  updateGene = (e) => {
    const gene = e.target.value.toLowerCase();
    this.setState(({ options }) => {
      return {
        options: Object.assign(
          {},
          options,
          {
            gene,
          }
        ),
        searchError: '',
      };
    });
  }
  updateGridHeight = () => {
    this.setState(({ data, gridHeight, gridHeightInput }) => {
      if (
        !isNaN(gridHeightInput) &&
        gridHeightInput >= 1
      ) {
        const newGridHeight = Number(gridHeightInput);
        const numCols = this.calculateCols(this.props.task.header, newGridHeight);
        const tableWidth = numCols * newGridHeight;
        const fontSize = this.getFontSize(newGridHeight);
        const headerHeight = this.getHeaderHeight(this.props.task.header, { fontSize });
        const numRows = this.calculateRows(headerHeight, newGridHeight);
        const tableHeight = this.getTableHeight(numRows, newGridHeight);
        return {
          gridHeight: newGridHeight,
          fontSize,
          headerHeight,
          numCols,
          numRows,
          page: this.subsetData(
            data,
            {
              start: 0,
              end: numRows,
            },
            {
              start: 0,
              end: numCols,
            }
          ),
          tableHeight,
          tableWidth,
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
      <TaskHeatmapView
        centerView={ this.state.centerView }
        changeGridHeight={ this.changeGridHeight }
        changeView={ {
          colBack: this.colBack,
          colForward: this.colForward,
          firstCol: this.firstCol,
          firstRow: this.firstRow,
          lastCol: this.lastCol,
          lastRow: this.lastRow,
          nextCol: this.nextCol,
          nextRow: this.nextRow,
          pageBack: this.pageBack,
          pageForward: this.pageForward,
          previousRow: this.previousRow,
          previousCol: this.previousCol,
        } }
        clearSearch={ this.clearSearch }
        colorRange={ this.state.colorRange }
        dimensions={ {
          headerHeight: this.state.headerHeight,
          rowNameWidth: this.state.rowNameWidth,
          tableHeight: this.state.tableHeight,
          tableWidth: this.state.tableWidth,
        } }
        fontSize={ this.state.fontSize }
        geneSearch={ this.geneSearch }
        gridColor={ {
          mono: this.gridMonoColor,
          two: this.gridTwoColor,
        } }
        gridHeight={ this.state.gridHeight }
        gridHeightInput={ this.state.gridHeightInput }
        highlightRow={ this.state.highlightRow }
        optionChange={ this.optionChange }
        options={ this.state.options }
        page={ this.state.page }
        pageHeader={ this.state.pageHeader }
        panel={ Object.assign(
          {},
          this.state.panel,
          {
            toggle: this.togglePanel,
          }
        ) }
        rangeChange={ this.rangeChange }
        rangeType={ this.state.rangeType }
        resetView={ this.resetView }
        searchError={ this.state.searchError }
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
        updateGene={ this.updateGene }
        updateGridHeight={ this.updateGridHeight }
      />
    );
  }
}

TaskHeatmapViewContainer.defaultProps = {
  style: {},
};

TaskHeatmapViewContainer.propTypes = {
  style: PropTypes.shape({}),
  task: viewTaskProp.isRequired,
};

export default TaskHeatmapViewContainer;
