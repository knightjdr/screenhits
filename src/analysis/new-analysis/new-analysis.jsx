import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DatePicker from 'material-ui/DatePicker';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import analysisStyle from '../analysis-style';
import Fields from '../../modules/fields';
import { uppercaseFirst } from '../../helpers/helpers';

const SelectableList = makeSelectable(List);

class NewAnalysis extends React.Component {
  getStepContent = (errors, formData, selection, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div
              style={ analysisStyle.helpBox }
            >
              Choose the type of Screen you would like to analyze. Samples will
              be filtered based on the type of screen selected and
              your user permissions.</div>
            <SelectField
              errorText={ errors.type }
              floatingLabelText="Screen type"
              fullWidth={ true }
              listStyle={ {
                paddingBottom: 0,
                paddingTop: 0,
              } }
              onChange={ (e, index, value) => { this.props.inputChange('type', value); } }
              style={ analysisStyle.input }
              value={ formData.type }
            >
              {
                Fields.screen.type.values.map((type) => {
                  return (
                    <MenuItem
                      key={ type }
                      value={ type }
                      primaryText={ type }
                    />
                  );
                })
              }
            </SelectField>
          </div>
        );
      case 1:
        return (
          <div>
            <div
              style={ analysisStyle.helpBox }
            >
              Choose the samples to analyze. Samples can be selected by project,
              screen, experiment or individually. Use filters to restrict
              available samples to those matching specific criteria.
            </div>
            <div
              style={ {
                display: 'flex',
                marginTop: 10,
              } }
            >
              <SelectableList
                onChange={ this.props.handleLevelChange }
                style={ {
                  backgroundColor: 'white',
                  padding: '0px 0px 0px 0px',
                  width: 200,
                  zIndex: 2,
                } }
                value={ selection.level }
              >
                <ListItem
                  leftIcon={ <FontAwesome key="project" name="folder-open" /> }
                  primaryText="Projects"
                  style={ analysisStyle.levelSelectionItem }
                  value="project"
                />
                <ListItem
                  leftIcon={ <FontAwesome key="screen" name="braille" /> }
                  primaryText="Screens"
                  style={ analysisStyle.levelSelectionItem }
                  value="screen"
                />
                <ListItem
                  leftIcon={ <FontAwesome key="experiment" name="bar-chart" /> }
                  primaryText="Experiments"
                  style={ analysisStyle.levelSelectionItem }
                  value="experiment"
                />
                <ListItem
                  leftIcon={ <FontAwesome key="sample" name="flask" /> }
                  primaryText="Samples"
                  style={ analysisStyle.levelSelectionItem }
                  value="sample"
                />
              </SelectableList>
              <Drawer
                containerStyle={ {
                  border: '1px solid #d4d6d7',
                  boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)',
                  position: 'absolute',
                  zIndex: 1,
                } }
                open={ selection.isDrawerOpen }
                style={ {
                  height: 280,
                  position: 'relative',
                  userSelect: 'none',
                } }
              >
                {
                  this.props.selection.items.length === 0 ?
                    <MenuItem
                      disabled={ true }
                      key="disabled-warning"
                    >
                      { `No matching ${this.props.selection.level}s`}
                    </MenuItem>
                    :
                    this.props.selection.items.map((item) => {
                      return (
                        <MenuItem
                          key={ item._id }
                          onTouchTap={ (e) => {
                            this.props.highlightSampleToAdd(e, item._id);
                          } }
                          style={
                            this.highlightMenuItem(
                              item._id,
                              this.props.samplesAdded,
                              this.props.samplesToAdd,
                              this.props.selection.level,
                            )
                          }
                          value={ item._id }
                        >
                          { `${item._id}: ${item.name}` }
                        </MenuItem>
                      );
                    })
                }
              </Drawer>
              <div
                style={ {
                  display: 'flex',
                  flexDirection: 'column',
                  height: 200,
                  justifyContent: 'center',
                  marginLeft: 300,
                } }
              >
                <FloatingActionButton
                  data-tip={ true }
                  data-for={ 'fab-add-samples' }
                  mini={ true }
                  onTouchTap={ this.props.addSamples }
                  style={ {
                    marginBottom: 10,
                  } }
                >
                  <ArrowRight />
                </FloatingActionButton>
                <FloatingActionButton
                  data-tip={ true }
                  data-for={ 'fab-remove-samples' }
                  mini={ true }
                  onTouchTap={ this.props.removeSamples }
                >
                  <ArrowLeft />
                </FloatingActionButton>
              </div>
              {
                this.props.samplesAdded.length > 0 &&
                  <div>
                    {
                      this.props.samplesAdded.map((sampleId) => {
                        const sampleIndex = this.props.samples.findIndex((arrSample) => {
                          return arrSample._id === sampleId;
                        });
                        const sample = this.props.samples[sampleIndex];
                        return (
                          <MenuItem
                            key={ sample._id }
                            onTouchTap={ (e) => {
                              this.props.highlightSampleToRemove(e, sample._id);
                            } }
                            style={
                              this.highlightMenuItem(
                                sample._id,
                                this.props.samplesToRemove,
                                [],
                                'sample',
                              )
                            }
                            value={ sample._id }
                          >
                            { `${sample._id}: ${sample.name}` }
                          </MenuItem>
                        );
                      })
                    }
                  </div>
              }
            </div>
            <ReactTooltip
              effect="solid"
              id="fab-add-samples"
              type="dark"
              place="top"
            >
              Add samples
            </ReactTooltip>
            <ReactTooltip
              effect="solid"
              id="fab-remove-samples"
              type="dark"
              place="top"
            >
              Remove samples
            </ReactTooltip>
          </div>
        );
      case 2:
        return (
          <div>
            Step 3
          </div>
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
  highlightMenuItem = (_id, arr1, arr2, level) => {
    return (arr1.includes(_id) && level === 'sample') || arr2.includes(_id) ?
      analysisStyle.menuItemSelected
      :
      {}
    ;
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
              <div
                style={ Object.assign(
                  {},
                  analysisStyle.helpBox,
                  {
                    textAlign: 'left',
                  }
                ) }
              >
                Filters
              </div>
              <div>
                <div
                  style={ {
                    display: 'flex-wrap',
                  } }
                >
                  <TextField
                    hintText="User name"
                    floatingLabelText="User name"
                    onChange={ (e) => { this.props.filterFuncs.user(e.target.value); } }
                    style={ analysisStyle.filterField }
                    type="text"
                    value={ this.props.filters.user }
                  />
                  <TextField
                    hintText={ `${uppercaseFirst(this.props.selection.level)} name` }
                    floatingLabelText={ `${uppercaseFirst(this.props.selection.level)} name contains` }
                    onChange={ (e) => { this.props.filterFuncs.name(e.target.value); } }
                    style={ analysisStyle.filterField }
                    type="text"
                    value={ this.props.filters.name }
                  />
                  <div
                    style={ analysisStyle.dateContainer }
                  >
                    <div
                      style={ analysisStyle.dateSubText }
                    >
                      Date:
                    </div>
                    <DatePicker
                      defaultDate={ this.props.dateRange.start }
                      floatingLabelText="From"
                      formatDate={ this.formatDate }
                      maxDate={ this.props.dateRange.fromEnd }
                      minDate={ this.props.dateRange.fromStart }
                      mode="landscape"
                      onChange={ (e, date) => { this.props.filterFuncs.fromDate(date); } }
                      style={ analysisStyle.dateSubField }
                      textFieldStyle={ analysisStyle.dateTextField }
                      value={ this.props.filters.date.min }
                    />
                    <DatePicker
                      defaultDate={ this.props.dateRange.end }
                      floatingLabelText="To"
                      formatDate={ this.formatDate }
                      maxDate={ this.props.dateRange.toEnd }
                      minDate={ this.props.dateRange.toStart }
                      mode="landscape"
                      onChange={ (e, date) => { this.props.filterFuncs.toDate(date); } }
                      style={ analysisStyle.dateSubField }
                      textFieldStyle={ analysisStyle.dateTextField }
                      value={ this.props.filters.date.max }
                    />
                  </div>
                  <FloatingActionButton
                    data-tip={ true }
                    data-for={ 'fab-apply-filters' }
                    mini={ true }
                    onTouchTap={ this.props.applyFilters }
                    style={ {
                      marginLeft: 15,
                    } }
                  >
                    <UpdateIcon />
                  </FloatingActionButton>
                  <FloatingActionButton
                    data-tip={ true }
                    data-for={ 'fab-reset-filters' }
                    mini={ true }
                    onTouchTap={ this.props.resetFilters }
                    style={ {
                      marginLeft: 15,
                    } }
                  >
                    <ClearIcon />
                  </FloatingActionButton>
                  <ReactTooltip
                    effect="solid"
                    id="fab-apply-filters"
                    type="dark"
                    place="top"
                  >
                    Apply filters
                  </ReactTooltip>
                  <ReactTooltip
                    effect="solid"
                    id="fab-reset-filters"
                    type="dark"
                    place="top"
                  >
                    Reset filters
                  </ReactTooltip>
                </div>
              </div>
            </div>
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
  errors: PropTypes.shape({
    type: PropTypes.string,
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
    type: PropTypes.string,
  }).isRequired,
  handleLevelChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  highlightSampleToAdd: PropTypes.func.isRequired,
  highlightSampleToRemove: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
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
  samples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
  samplesAdded: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  samplesToAdd: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  samplesToRemove: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  selection: PropTypes.shape({
    isDrawerOpen: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    level: PropTypes.string,
  }).isRequired,
  stepIndex: PropTypes.number.isRequired,
};

export default muiThemeable()(NewAnalysis);
