import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
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
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import analysisStyle from '../analysis-style';
import Fields from '../../modules/fields';

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
              screen, experiment or individually. Use the filters menu to restrict
              available samples to those matching specific criteria.
            </div>
            <div
              style={ {
                display: 'flex',
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
                } }
              >
                {
                  this.props.selection.items.map((item) => {
                    return (
                      <MenuItem
                        key={ item._id }
                        onTouchTap={ () => { this.props.highlightSampleToAdd(item._id); } }
                        style={
                          this.highlightMenuItem(
                            item._id,
                            this.props.samplesAdded,
                            this.props.samplesToAdd
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
  highlightMenuItem = (_id, arr1, arr2) => {
    return arr1.includes(_id) || arr2.includes(_id) ? analysisStyle.menuItemSelected : {};
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
  removeSamples: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
  handleLevelChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  highlightSampleToAdd: PropTypes.func.isRequired,
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
  samplesAdded: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  samplesToAdd: PropTypes.arrayOf(
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
