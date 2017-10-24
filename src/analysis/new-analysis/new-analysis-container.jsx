import React from 'react';

import NewAnalysis from './new-analysis';

const available = {
  project: [
    { _id: 1, name: 'Project 1' },
    { _id: 2, name: 'Project 2' },
  ],
  screen: [
    { _id: 1, name: 'Screen 1', group: { project: 1 } },
    { _id: 2, name: 'Screen 2', group: { project: 1 } },
  ],
  experiment: [
    { _id: 1, name: 'Experiment 1', group: { project: 1, screen: 1 } },
    { _id: 2, name: 'Experiment 2', group: { project: 1, screen: 2 } },
  ],
  sample: [
    { _id: 1, name: 'Sample 1', group: { experiment: 1, project: 1, screen: 1 } },
    { _id: 2, name: 'Sample 2', group: { experiment: 1, project: 1, screen: 1 } },
  ],
};

class NewAnalysisContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samplesAdded: [],
      samplesToAdd: [],
      errors: {
        type: null,
      },
      formData: {
        type: null,
      },
      selection: {
        isDrawerOpen: true,
        items: available.sample,
        level: 'sample',
      },
      stepIndex: 1,
    };
  }
  addSamples = () => {
    this.setState(({ samplesAdded, samplesToAdd }) => {
      return {
        samplesAdded: [...new Set(samplesAdded.concat(samplesToAdd))].sort(),
        samplesToAdd: [],
      };
    });
  }
  removeSamples = () => {

  }
  checkErrors = (index) => {
    switch (index) {
      case 0:
        return !this.state.formData.type ?
        {
          isError: true,
          errors: {
            type: 'Please specify a screen type',
          },
        }
        :
        {
          isError: false,
          errors: {
            type: null,
          },
        }
      ;
      default:
        return { isError: false }
      ;
    }
  }
  handleLevelChange = (e, level) => {
    const items = available[level];
    this.setState({
      samplesToAdd: [],
      selection: {
        isDrawerOpen: false,
        items: [],
        level,
      },
    });
    setTimeout(() => {
      this.setState({
        selection: {
          isDrawerOpen: true,
          items,
          level,
        },
      });
    }, 1000);
  }
  handleNext = () => {
    const { stepIndex } = this.state;
    const { isError, errors } = this.checkErrors(stepIndex);
    if (isError) {
      this.setState({
        errors,
      });
    } else {
      this.setState({
        errors,
        stepIndex: stepIndex + 1,
      });
    }
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
      });
    }
  };
  highlightSampleToAdd = (_id) => {
    this.setState(({ samplesToAdd }) => {
      const index = samplesToAdd.indexOf(_id);
      if (index > -1) {
        samplesToAdd.splice(index, 1);
      } else {
        samplesToAdd.push(_id);
      }
      return {
        samplesToAdd,
      };
    });
  }
  inputChange = (type, value) => {
    const { errors, formData } = this.state;
    errors[type] = null;
    formData[type] = value;
    this.setState({
      errors,
      formData,
    });
  }
  render() {
    return (
      <NewAnalysis
        addSamples={ this.addSamples }
        highlightSampleToAdd={ this.highlightSampleToAdd }
        errors={ this.state.errors }
        formData={ this.state.formData }
        handleLevelChange={ this.handleLevelChange }
        handleNext={ this.handleNext }
        handlePrev={ this.handlePrev }
        inputChange={ this.inputChange }
        removeSamples={ this.removeSamples }
        samplesAdded={ this.state.samplesAdded }
        samplesToAdd={ this.state.samplesToAdd }
        selection={ this.state.selection }
        stepIndex={ this.state.stepIndex }
      />
    );
  }
}
export default NewAnalysisContainer;
