import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import Comparison from '../comparison/comparison-container';
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
            errors={ this.props.errors }
            fetchStatus={ this.props.fetchStatus }
            filterFuncs={ this.props.filterFuncs }
            filters={ this.props.filters }
            handleLevelChange={ this.props.handleLevelChange }
            highlightSampleToAdd={ this.props.highlightSampleToAdd }
            highlightSampleToRemove={ this.props.highlightSampleToRemove }
            removeSamples={ this.props.removeSamples }
            resetFilters={ this.props.resetFilters }
            samples={ this.props.samples }
            samplesToAdd={ this.props.samplesToAdd }
            sampleTooltip={ this.props.sampleTooltip }
            samplesToRemove={ this.props.samplesToRemove }
            screenSize={ this.props.screenSize }
            selected={ this.props.selected }
            selection={ selection }
            showTooltips={ this.props.showTooltips }
            toggleTooltip={ this.props.toggleTooltip }
          />
        );
      case 2:
        return (
          <DesignAnalysis
            availableSamples={ this.props.samples }
            design={ this.props.design }
            dialog={ this.props.dialog }
            errors={ errors }
            formData={ formData }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            metric={ this.props.metric }
            readout={ this.props.readout }
            resetParameters={ this.props.resetParameters }
            screenSize={ this.props.screenSize }
            selected={ this.props.selected.items }
            updateDesign={ this.props.updateDesign }
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
      <div
        style={ {
          color: this.props.muiTheme.palette.textColor,
          overflowY: 'hidden',
        } }
      >
        {
          !this.props.viewComparison &&
          <Scrollbars
            autoHide={ true }
            autoHideTimeout={ 1000 }
            autoHideDuration={ 200 }
            autoHeight={ true }
            autoHeightMax={ 'calc(100vh - 90px)' }
            renderThumbVertical={ ({ style, props }) => {
              return (
                <div
                  { ...props }
                  style={ Object.assign(
                    {},
                    style,
                    {
                      backgroundColor: this.props.muiTheme.palette.alternativeButtonColor,
                      borderRadius: 4,
                      opacity: 0.5,
                      width: 8,
                    }
                  ) }
                />
              );
            } }
          >
            <Stepper activeStep={ this.props.stepIndex }>
              <Step>
                <StepLabel>Choose screen type</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select samples</StepLabel>
              </Step>
              <Step>
                <StepLabel>Design analysis</StepLabel>
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
                  onTouchTap={ this.props.handlePrev }
                  style={ {
                    color: this.props.muiTheme.palette.offWhite,
                    display: this.props.stepIndex === 0 ? 'none' : 'inline',
                    marginRight: 10,
                  } }
                />
                {
                  <FlatButton
                    backgroundColor={ this.props.muiTheme.palette.darkButtonColor }
                    hoverColor={ this.props.muiTheme.palette.darkButtonColorHover }
                    label={ this.props.stepIndex === 2 ? 'Submit' : 'Next' }
                    onTouchTap={ this.props.stepIndex === 2 ?
                      this.props.submit
                      :
                      this.props.handleNext
                    }
                    style={ {
                      color: this.props.muiTheme.palette.offWhite,
                    } }
                  />
                }
              </div>
            </div>
          </Scrollbars>
        }
        {
          this.props.viewComparison &&
          <Comparison
            comparisonState={ this.props.comparisonState }
          />
        }
        <Snackbar
          autoHideDuration={ this.props.snackbar.duration }
          message={ this.props.snackbar.message }
          open={ this.props.snackbar.open }
          onRequestClose={ this.props.snackbar.close }
        />
      </div>
    );
  }
}

NewAnalysis.defaultProps = {
  design: [],
  metric: [],
  readout: [],
};

NewAnalysis.propTypes = {
  addSamples: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  comparisonState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    isSubmitted: PropTypes.bool,
    item: PropTypes.shape({}),
    message: PropTypes.string,
  }).isRequired,
  dateRange: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    fromEnd: PropTypes.instanceOf(Date),
    fromStart: PropTypes.instanceOf(Date),
    toEnd: PropTypes.instanceOf(Date),
    toStart: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),
  }).isRequired,
  design: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
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
    analysisName: PropTypes.string,
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
    selectedSamples: PropTypes.string,
  }).isRequired,
  fetchStatus: PropTypes.shape({
    isFetcing: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    message: PropTypes.string,
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
    analysisName: PropTypes.string,
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
  metric: PropTypes.arrayOf(
    PropTypes.shape({
      layName: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
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
  readout: PropTypes.arrayOf(
    PropTypes.shape({
      layName: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  removeSamples: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  resetParameters: PropTypes.func.isRequired,
  samples: PropTypes.arrayOf(
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
  samplesToAdd: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  sampleTooltip: PropTypes.shape({
    _id: PropTypes.number,
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
  showTooltips: PropTypes.shape({
    selectionAdd: PropTypes.bool,
    selectionRemove: PropTypes.bool,
  }).isRequired,
  snackbar: PropTypes.shape({
    close: PropTypes.func,
    duration: PropTypes.number,
    message: PropTypes.string,
    open: PropTypes.bool,
  }).isRequired,
  stepIndex: PropTypes.number.isRequired,
  submit: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  updateDesign: PropTypes.func.isRequired,
  viewComparison: PropTypes.bool.isRequired,
};

export default muiThemeable()(NewAnalysis);
