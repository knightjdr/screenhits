import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import DesignAnalysis from './design-analysis';
import SelectSamples from './select-samples';
import SelectScreenType from './select-screen-type';

class NewAnalysis extends React.Component {
  getStepContent = (errors, formData, selection, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <SelectScreenType
            errors={ errors }
            formData={ formData }
            inputChange={ this.props.inputChange }
            screenSize={ this.props.screenSize }
          />
        );
      case 1:
        return (
          <SelectSamples
            addSamples={ this.props.addSamples }
            applyFilters={ this.props.applyFilters }
            dateRange={ this.props.dateRange }
            filterFuncs={ this.props.filterFuncs }
            filters={ this.props.filters }
            handleLevelChange={ this.props.handleLevelChange }
            highlightSampleToAdd={ this.props.highlightSampleToAdd }
            highlightSampleToRemove={ this.props.highlightSampleToRemove }
            screenSize={ this.props.screenSize }
            removeSamples={ this.props.removeSamples }
            resetFilters={ this.props.resetFilters }
            samples={ this.props.samples }
            samplesToAdd={ this.props.samplesToAdd }
            samplesToRemove={ this.props.samplesToRemove }
            selected={ this.props.selected }
            selection={ selection }
          />
        );
      case 2:
        return (
          <DesignAnalysis
            dialog={ this.props.dialog }
            errors={ errors }
            formData={ formData }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            resetParameters={ this.props.resetParameters }
            screenSize={ this.props.screenSize }
          />
        );
      default:
        return (
          <div>
            Invalid step
          </div>
        );
    }
  }
  formatDate = (date) => {
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
  render() {
    return (
      <Paper
        style={ {
          color: this.props.muiTheme.palette.textColor,
          maxHeight: 'calc(100vh - 70px)',
          overflowY: 'hidden',
          padding: '15px 15px 10px 15px',
        } }
        zDepth={ 2 }
      >
        <Scrollbars
          autoHide={ true }
          autoHideTimeout={ 1000 }
          autoHideDuration={ 200 }
          autoHeight={ true }
          autoHeightMax={ 'calc(100vh - 90px)' }
        >
          <Stepper activeStep={ this.props.stepIndex }>
            <Step>
              <StepLabel>Choose screen type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Select samples</StepLabel>
            </Step>
            <Step>
              <StepLabel>Analysis type</StepLabel>
            </Step>
          </Stepper>
          <div>
            {
              this.getStepContent(
                this.props.errors,
                this.props.formData,
                this.props.selection,
                this.props.stepIndex,
              )
            }
            <div
              style={ {
                marginTop: 20,
              } }
            >
              <FlatButton
                backgroundColor={ this.props.muiTheme.palette.alternativeButtonColor }
                hoverColor={ this.props.muiTheme.palette.alternativeButtonColorHover }
                label="Back"
                disabled={ this.props.stepIndex === 0 }
                onTouchTap={ this.props.handlePrev }
                style={ {
                  color: this.props.muiTheme.palette.offWhite,
                  marginRight: 10,
                } }
              />
              <FlatButton
                backgroundColor={ this.props.muiTheme.palette.darkButtonColor }
                hoverColor={ this.props.muiTheme.palette.darkButtonColorHover }
                label="Next"
                disabled={ this.props.stepIndex === 2 }
                onTouchTap={ this.props.handleNext }
                style={ {
                  color: this.props.muiTheme.palette.offWhite,
                } }
              />
            </div>
          </div>
        </Scrollbars>
      </Paper>
    );
  }
}

NewAnalysis.propTypes = {
  addSamples: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    fromEnd: PropTypes.instanceOf(Date),
    fromStart: PropTypes.instanceOf(Date),
    toEnd: PropTypes.instanceOf(Date),
    toStart: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),
  }).isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    defaultValue: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
  }).isRequired,
  filterFuncs: PropTypes.shape({
    fromDate: PropTypes.func,
    name: PropTypes.func,
    toDate: PropTypes.func,
    user: PropTypes.func,
  }).isRequired,
  filters: PropTypes.shape({
    date: PropTypes.shape({
      max: PropTypes.instanceOf(Date),
      min: PropTypes.instanceOf(Date),
    }),
    name: PropTypes.string,
    user: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
  }).isRequired,
  handleLevelChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  highlightSampleToAdd: PropTypes.func.isRequired,
  highlightSampleToRemove: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
      alternativeButtonColorHover: PropTypes.string,
      darkButtonColor: PropTypes.string,
      darkButtonColorHover: PropTypes.string,
      primary1Color: PropTypes.string,
      offWhite: PropTypes.string,
      textColor: PropTypes.string,
    }),
  }).isRequired,
  removeSamples: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  resetParameters: PropTypes.func.isRequired,
  samples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
  samplesToAdd: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  samplesToRemove: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  screenSize: PropTypes.shape({
    isLarge: PropTypes.bool,
    isSmall: PropTypes.bool,
  }).isRequired,
  selected: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.number
    ),
    last: PropTypes.number,
  }).isRequired,
  selection: PropTypes.shape({
    isDrawerOpen: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    last: PropTypes.number,
    level: PropTypes.string,
  }).isRequired,
  stepIndex: PropTypes.number.isRequired,
};

export default muiThemeable()(NewAnalysis);
