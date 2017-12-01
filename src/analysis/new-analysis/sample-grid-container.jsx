import PropTypes from 'prop-types';
import React from 'react';

import SampleGrid from './sample-grid';

// parameters
const cellWidth = 150;
const gridGap = 5;

const emptyDesign = [
  {
    name: 'Control',
    items: [],
  },
];
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

class SampleGridContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellWidth,
      design: emptyDesign,
      dragID: null,
      gridDimensions: {
        cols: 1,
        rows: 3,
      },
      gridScrollPosition: 0,
      gridWidth: cellWidth + 48, // 48 is for icon buttons
      showTooltips: false,
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
      unselectedSamples: this.getAllSamples(this.props.selected, this.props.availableSamples),
    };
  }
  componentDidMount = () => {
    window.addEventListener('wheel', this.handleScroll);
  }
  componentWillUnmount = () => {
    window.removeEventListener('wheel', this.handleScroll);
  }
  getAllSamples = (selected, available) => {
    return selected.map((_id) => {
      const index = available.findIndex((availableSample) => {
        return availableSample._id === _id;
      });
      return available[index];
    });
  }
  getAvailableIndex = (_id) => {
    return this.props.availableSamples.findIndex((availableSample) => {
      return availableSample._id === _id;
    });
  }
  setGridWidth = (width) => {
    this.setState({
      gridWidth: width - 58, // 48 is for icon buttons, 10 is for padding
    });
  }
  addColumn = (scrollWidth) => {
    this.setState(({ design, gridDimensions, gridScrollPosition, gridWidth }) => {
      const newColumnNumber = gridDimensions.cols + 1;
      const newDesign = JSON.parse(JSON.stringify(design));
      newDesign.push({
        name: `Sample set ${newColumnNumber - 1}`,
        items: [],
      });
      return {
        design: newDesign,
        gridDimensions: {
          cols: newColumnNumber,
          rows: gridDimensions.rows,
        },
        gridScrollPosition: newColumnNumber * (cellWidth + 5) > gridWidth ?
          this.scrollPosition(
            gridScrollPosition,
            cellWidth + gridGap,
            scrollWidth + (cellWidth + gridGap),
            gridWidth,
          )
          :
          0,
      };
    });
  }
  addRow = () => {
    this.setState(({ gridDimensions }) => {
      return {
        gridDimensions: {
          cols: gridDimensions.cols,
          rows: gridDimensions.rows + 1,
        },
      };
    });
  }
  changeColumnHeader = (index, value) => {
    this.setState(({ design }) => {
      const newDesign = JSON.parse(JSON.stringify(design));
      newDesign[index].name = value;
      // update form state in parent container
      this.props.updateDesign(newDesign);
      return {
        design: newDesign,
      };
    });
  }
  dragEndOrigin = () => {
    this.setState({
      dragID: null,
    });
  }
  dragOrigin = (_id) => {
    this.setState({
      dragID: _id,
    });
  }
  dragOverTargetCell = (e) => {
    e.preventDefault();
  }
  dragStartOrigin = (e, _id, name, origin, replicate, selectedColumn) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ _id, name, origin, replicate, selectedColumn }));
    this.setState({
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
  droppedTargetCell = (e, destination, col, row) => {
    const { _id, name, origin, replicate, selectedColumn } = JSON.parse(e.dataTransfer.getData('text/plain'));
    this.setState(({ design, unselectedSamples }) => {
      const newDesign = JSON.parse(JSON.stringify(design));
      const newUnselectedSamples = Object.assign([], unselectedSamples);
      // samples returned to 'unselected box'
      if (destination === 'unselected') {
        if (origin === 'selected') {
          const designIndex = newDesign[selectedColumn - 1].items.findIndex((selectedSample) => {
            return selectedSample._id === _id;
          });
          newDesign[selectedColumn - 1].items.splice(designIndex, 1);
          const availableIndex = this.getAvailableIndex(_id);
          newUnselectedSamples.push(this.props.availableSamples[availableIndex]);
          newUnselectedSamples.sort((a, b) => { return a._id - b._id; });
        }
      } else { // sample moved to selected grid
        if (origin === 'unselected') {
          const index = newUnselectedSamples.findIndex((sample) => {
            return sample._id === _id;
          });
          newUnselectedSamples.splice(index, 1);
        } else {
          const index = newDesign[selectedColumn - 1].items.findIndex((selectedSample) => {
            return selectedSample._id === _id;
          });
          newDesign[selectedColumn - 1].items.splice(index, 1);
        }
        // increment underlying samples
        if (
          newDesign[col - 1] &&
          newDesign[col - 1].items
        ) {
          let checkRow = row;
          newDesign[col - 1].items.forEach((sample) => {
            const currSample = sample;
            if (currSample.row === checkRow) {
              currSample.row += 1;
              checkRow += 1;
            }
          });
        }
        // add sample
        newDesign[col - 1].items.push({
          _id,
          name,
          replicate,
          col,
          row,
        });
        newDesign[col - 1].items.sort((a, b) => { return a.row - b.row; });
      }
      // update form state in parent container
      this.props.updateDesign(newDesign);
      return {
        dragID: null,
        design: newDesign,
        unselectedSamples: newUnselectedSamples,
      };
    });
  }
  handleScroll = () => {
    this.setState({
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
  hideTooltip = () => {
    this.setState({
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
  removeColumn = () => {
    this.setState(({ design, gridDimensions, unselectedSamples }) => {
      if (gridDimensions.cols > 1) {
        const newColumnNumber = gridDimensions.cols - 1;
        const newDesign = JSON.parse(JSON.stringify(design));
        const newUnselectedSamples = JSON.parse(JSON.stringify(unselectedSamples));
        const removeColumn = newDesign.length - 1;
        newDesign[removeColumn].items.forEach((sample) => {
          const availableIndex = this.getAvailableIndex(sample._id);
          newUnselectedSamples.push(this.props.availableSamples[availableIndex]);
        });
        newUnselectedSamples.sort((a, b) => { return a._id - b._id; });
        newDesign.splice(removeColumn, 1);
        return {
          design: newDesign,
          gridDimensions: {
            cols: newColumnNumber,
            rows: gridDimensions.rows,
          },
          unselectedSamples: newUnselectedSamples,
        };
      }
      return {};
    });
  }
  removeRow = () => {
    this.setState(({ design, gridDimensions, unselectedSamples }) => {
      if (gridDimensions.rows > 1) {
        const newDesign = [];
        const newUnselectedSamples = JSON.parse(JSON.stringify(unselectedSamples));
        const removeRow = gridDimensions.rows + 1;
        design.forEach((sampleSet) => {
          const currSampleSet = JSON.parse(JSON.stringify(sampleSet));
          currSampleSet.items.forEach((sample, index) => {
            if (sample.row === removeRow) {
              const availableIndex = this.getAvailableIndex(sample._id);
              newUnselectedSamples.push(this.props.availableSamples[availableIndex]);
              currSampleSet.items.splice(index, 1);
            }
          });
          newDesign.push(currSampleSet);
        });
        newUnselectedSamples.sort((a, b) => { return a._id - b._id; });
        return {
          design: newDesign,
          gridDimensions: {
            cols: gridDimensions.cols,
            rows: gridDimensions.rows - 1,
          },
          unselectedSamples: newUnselectedSamples,
        };
      }
      return {};
    });
  }
  resetDesign = () => {
    this.setState(({ design, unselectedSamples }) => {
      const newDesign = JSON.parse(JSON.stringify(design));
      const newUnselectedSamples = JSON.parse(JSON.stringify(unselectedSamples));
      newDesign.forEach((column) => {
        column.items.forEach((sample) => {
          const availableIndex = this.getAvailableIndex(sample._id);
          newUnselectedSamples.push(this.props.availableSamples[availableIndex]);
        });
      });
      newUnselectedSamples.sort((a, b) => { return a._id - b._id; });
      return {
        design: emptyDesign,
        gridDimensions: {
          cols: 1,
          rows: 3,
        },
        gridScrollPosition: 0,
        unselectedSamples: newUnselectedSamples,
      };
    });
  }
  scrollGrid = (e, scrollWidth) => {
    e.preventDefault();
    const deltaY = e.deltaY;
    this.setState(({ gridScrollPosition, gridWidth }) => {
      return {
        gridScrollPosition: this.scrollPosition(
          gridScrollPosition,
          deltaY,
          scrollWidth,
          gridWidth
        ),
      };
    });
  }
  scrollPosition = (start, delta, scrollWidth, gridWidth) => {
    const max = scrollWidth - gridWidth;
    let newPosition = start + delta;
    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > max) {
      newPosition = max;
    }
    return newPosition;
  }
  showSampleTooltip = (e, _id, position, show) => {
    if (show) {
      const availableIndex = this.getAvailableIndex(_id);
      const sample = this.props.availableSamples[availableIndex];
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
      const tooltipText = [
        `ID: ${sample._id}`,
        `Name: ${sample.name}`,
        `Project: ${sample.group.project}`,
        `Screen: ${sample.group.screen}`,
        `Experiment: ${sample.group.experiment}`,
      ];
      if (sample.replicate) {
        tooltipText.push(`Rep: ${sample.replicate}`);
      }
      if (sample.concentration) {
        tooltipText.push(`Concentration: ${sample.concentration}`);
      }
      if (sample.timepoint) {
        tooltipText.push(`Timepoint: ${sample.timepoint}`);
      }
      this.setState({
        tooltip: {
          _id,
          position,
          rect,
          show: true,
          text: tooltipText,
        },
      });
    }
  }
  toggleTooltip = () => {
    this.setState(({ showTooltips }) => {
      return {
        showTooltips: !showTooltips,
      };
    });
  }
  updateScrollPosition = (left) => {
    this.setState({
      gridScrollPosition: left,
    });
  }
  render() {
    return (
      <SampleGrid
        addColumn={ this.addColumn }
        addRow={ this.addRow }
        cellWidth={ this.state.cellWidth }
        changeColumnHeader={ this.changeColumnHeader }
        design={ this.state.design }
        dragFuncs={ {
          dragEndOrigin: this.dragEndOrigin,
          dragOrigin: this.dragOrigin,
          dragOverTargetCell: this.dragOverTargetCell,
          dragStartOrigin: this.dragStartOrigin,
          droppedTargetCell: this.droppedTargetCell,
        } }
        dragID={ this.state.dragID }
        gridDimensions={ this.state.gridDimensions }
        gridScrollPosition={ this.state.gridScrollPosition }
        gridWidth={ this.state.gridWidth }
        removeColumn={ this.removeColumn }
        removeRow={ this.removeRow }
        resetDesign={ this.resetDesign }
        sampleTooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            hideFunc: this.hideTooltip,
            showFunc: this.showSampleTooltip,
          }
        ) }
        scrollGrid={ this.scrollGrid }
        setGridWidth={ this.setGridWidth }
        showTooltips={ this.state.showTooltips }
        toggleTooltip={ this.toggleTooltip }
        unselectedSamples={ this.state.unselectedSamples }
        updateScrollPosition={ this.updateScrollPosition }
      />
    );
  }
}

SampleGridContainer.propTypes = {
  availableSamples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
      group: PropTypes.shape({
        experiment: PropTypes.number,
        project: PropTypes.number,
        screen: PropTypes.number,
      }),
      replicate: PropTypes.string,
    })
  ).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired,
  updateDesign: PropTypes.func.isRequired,
};

export default SampleGridContainer;
