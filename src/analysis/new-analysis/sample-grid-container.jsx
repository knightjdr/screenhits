import PropTypes from 'prop-types';
import React from 'react';

import SampleGrid from './sample-grid';

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
      design: [
        {
          name: 'Control',
          items: [],
        },
      ],
      dragID: null,
      gridDimensions: {
        cols: 1,
        rows: 3,
      },
      tooltip: {
        _id: null,
        rect: emptyRect,
        show: false,
        text: '',
      },
      unselectedSamples: this.getAllSamples(this.props.selected, this.props.availableSamples),
    };
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
  addColumn = () => {
    this.setState(({ design, gridDimensions }) => {
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
  dragStartOrigin = (e, _id, name, origin, selectedColumn) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ _id, name, origin, selectedColumn }));
    this.setState({
      tooltip: {
        _id: null,
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
  droppedTargetCell = (e, destination, col, row) => {
    const { _id, name, origin, selectedColumn } = JSON.parse(e.dataTransfer.getData('text/plain'));
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
          col,
          row,
        });
        newDesign[col - 1].items.sort((a, b) => { return a.row - b.row; });
      }
      return {
        dragID: null,
        design: newDesign,
        unselectedSamples: newUnselectedSamples,
      };
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
  showSampleTooltip = (e, _id) => {
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
    this.setState(({ tooltip }) => {
      const hideTooltip = tooltip._id === _id;
      return {
        tooltip: {
          _id: hideTooltip ? null : _id,
          rect: hideTooltip ? emptyRect : rect,
          show: !hideTooltip,
          text: hideTooltip ? '' : tooltipText,
        },
      };
    });
  }
  render() {
    return (
      <SampleGrid
        addColumn={ this.addColumn }
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
        removeColumn={ this.removeColumn }
        sampleTooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            func: this.showSampleTooltip,
          }
        ) }
        unselectedSamples={ this.state.unselectedSamples }
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
    })
  ).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired,
};

export default SampleGridContainer;
