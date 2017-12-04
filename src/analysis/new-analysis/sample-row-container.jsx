import PropTypes from 'prop-types';
import React from 'react';

import SampleRow from './sample-row';


const emptyDesign = [
  {
    name: 'Ordered samples',
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

class SampleRowContainer extends React.Component {
  constructor(props) {
    super(props);
    const { toDesign, totalSamples } = this.getAllToDesignSamples(
      this.props.selected,
      this.props.design,
      this.props.availableSamples
    );
    this.state = {
      design: JSON.parse(JSON.stringify(this.props.design)),
      dragID: null,
      gridRows: totalSamples,
      showTooltips: false,
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
      unselectedSamples: toDesign,
    };
  }
  getAllToDesignSamples = (selected, design, available) => {
    // get all samples already in design grid
    const inDesign = [];
    design.forEach((sampleSet) => {
      sampleSet.items.forEach((sample) => {
        inDesign.push(sample._id);
      });
    });
    // return samples not yet in design grid
    const toDesign = [];
    selected.forEach((_id) => {
      if (!inDesign.includes(_id)) {
        const index = available.findIndex((availableSample) => {
          return availableSample._id === _id;
        });
        toDesign.push(available[index]);
      }
    });
    return {
      toDesign,
      totalSamples: inDesign.length + toDesign.length,
    };
  }
  getAvailableIndex = (_id) => {
    return this.props.availableSamples.findIndex((availableSample) => {
      return availableSample._id === _id;
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
      this.props.updateDesign(emptyDesign);
      return {
        design: emptyDesign,
        unselectedSamples: newUnselectedSamples,
      };
    });
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
  render() {
    return (
      <SampleRow
        design={ this.state.design }
        dragFuncs={ {
          dragEndOrigin: this.dragEndOrigin,
          dragOrigin: this.dragOrigin,
          dragOverTargetCell: this.dragOverTargetCell,
          dragStartOrigin: this.dragStartOrigin,
          droppedTargetCell: this.droppedTargetCell,
        } }
        dragID={ this.state.dragID }
        gridRows={ this.state.gridRows }
        resetDesign={ this.resetDesign }
        sampleTooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            hideFunc: this.hideTooltip,
            showFunc: this.showSampleTooltip,
          }
        ) }
        showTooltips={ this.state.showTooltips }
        toggleTooltip={ this.toggleTooltip }
        unselectedSamples={ this.state.unselectedSamples }
      />
    );
  }
}

SampleRowContainer.defaultProps = {
  design: [
    {
      name: 'Control',
      items: [],
    },
  ],
};

SampleRowContainer.propTypes = {
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
  design: PropTypes.arrayOf(
    PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({}),
      ),
      name: PropTypes.string,
    }),
  ),
  selected: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired,
  updateDesign: PropTypes.func.isRequired,
};

export default SampleRowContainer;
