import PropTypes from 'prop-types';
import React from 'react';

import SampleGrid from './sample-grid';

class SampleGridContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      design: [
        {
          name: 'Control',
          items: [],
        },
        {
          name: 'Sample set 1',
          items: [],
        },
      ],
      dragID: null,
      gridDimensions: {
        cols: 2,
        rows: 3,
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
  dragEndOrigin = () => {
    this.setState({
      dragID: null,
    });
  }
  dragEnterTargetCell = () => {
  }
  dragLeaveTargetCell = () => {
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
  }
  droppedTargetCell = (e, col, row) => {
    const { _id, name, origin, selectedColumn } = JSON.parse(e.dataTransfer.getData('text/plain'));
    this.setState(({ design, unselectedSamples }) => {
      const newDesign = JSON.parse(JSON.stringify(design));
      const newUnselectedSamples = Object.assign([], unselectedSamples);
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
      newDesign[col - 1].items.push({
        _id,
        name,
        col,
        row,
      });
      return {
        dragID: null,
        design: newDesign,
        unselectedSamples: origin === 'unselected' ? newUnselectedSamples : unselectedSamples,
      };
    });
  }
  render() {
    return (
      <SampleGrid
        design={ this.state.design }
        dragFuncs={ {
          dragEndOrigin: this.dragEndOrigin,
          dragEnterTargetCell: this.dragEnterTargetCell,
          dragLeaveTargetCell: this.dragLeaveTargetCell,
          dragOrigin: this.dragOrigin,
          dragOverTargetCell: this.dragOverTargetCell,
          dragStartOrigin: this.dragStartOrigin,
          droppedTargetCell: this.droppedTargetCell,
        } }
        dragID={ this.state.dragID }
        gridDimensions={ this.state.gridDimensions }
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
