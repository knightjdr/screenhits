import Cached from 'material-ui/svg-icons/action/cached';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import analysisStyle from '../analysis-style';
import AnalysisOptions from '../../modules/analysis-new';
import SampleGrid from './sample-grid-container';

class DesignAnalysis extends React.Component {
  getInputType = (parameter) => {
    switch (parameter.element) {
      case 'SelectField':
        return (
          <SelectField
            floatingLabelText={ parameter.layName }
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ (e, index, value) => { this.props.inputChange(parameter.name, value); } }
            style={ analysisStyle.inputWithHelpSelect }
            value={ this.props.formData[parameter.name] }
          >
            {
              parameter.options.map((option) => {
                return (
                  <MenuItem
                    key={ option.value }
                    value={ option.value }
                    primaryText={ option.name }
                  />
                );
              })
            }
          </SelectField>
        );
      case 'CheckBox':
        return (
          <Checkbox
            checked={ this.props.formData[parameter.name] }
            key={ `${parameter.name}-input` }
            label={ parameter.layName }
            onCheck={ () => {
              this.props.inputChange(
                parameter.name,
                !this.props.formData[parameter.name]
              );
            } }
            style={ analysisStyle.checkbox }
          />
        );
      default:
        return (
          <TextField
            key={ `${parameter.name}-input` }
            floatingLabelText={ parameter.layName }
            fullWidth={ true }
            onChange={ (e) => {
              this.props.inputChange(parameter.name, e.target.value);
            } }
            onDrop={ (e) => { e.preventDefault(); } }
            type={ parameter.inputType }
            value={ this.props.formData[parameter.name] }
          />
        );
    }
  }
  getInputStyle = (type) => {
    switch (type) {
      case 'CheckBox':
        return analysisStyle.checkboxWithHelp;
      default:
        return analysisStyle.inputWithHelp;
    }
  }
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
      />,
    ]);
  }
  render() {
    return (
      <div>
        <div
          style={
            this.props.screenSize.isLarge ?
            analysisStyle.helpBoxLarge
            :
            analysisStyle.helpBox
          }
        >
          Specify the type of analysis you would like to perform, adjust
          parameters as needed and design your analysis.
        </div>
        <SelectField
          errorText={ this.props.errors.analysisType }
          floatingLabelText="Analysis type"
          fullWidth={ true }
          listStyle={ {
            paddingBottom: 0,
            paddingTop: 0,
          } }
          onChange={ (e, index, value) => { this.props.inputChange('analysisType', value); } }
          style={ analysisStyle.input }
          value={ this.props.formData.analysisType }
        >
          {
            AnalysisOptions[this.props.formData.screenType].options.map((type) => {
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
        {
          this.props.formData.analysisType &&
          <div>
            <div
              style={ Object.assign(
                {},
                this.props.screenSize.isSmall ?
                analysisStyle.helpBoxSubSmall
                :
                analysisStyle.helpBoxSub,
                {
                  marginTop: 10,
                }
              ) }
            >
              Parameter options
            </div>
            <div
              style={ {
                display: 'flex',
                flexWrap: 'wrap',
              } }
            >
              {
                AnalysisOptions[this.props.formData.screenType][this.props.formData.analysisType]
                .parameters.map((parameter) => {
                  return (
                    <div
                      key={ `${parameter.name}-container` }
                      style={ Object.assign(
                        {},
                        this.getInputStyle(parameter.element),
                        {
                          width: this.props.inputWidth,
                        },
                      ) }
                    >
                      { this.getInputType(parameter) }
                      <IconButton
                        key={ `${parameter.name}-helpButton` }
                        onTouchTap={ () => {
                          this.props.dialog.open(
                            `Help for the "${parameter.layName}" field`,
                            parameter.helpText,
                            parameter.defaultValue,
                          );
                        } }
                        tooltip="Help"
                        tooltipPosition="top-center"
                      >
                        <HelpIcon
                          key={ `${parameter.name}-helpIcon` }
                        />
                      </IconButton>
                    </div>
                  );
                })
              }
              <div>
                <FloatingActionButton
                  data-tip={ true }
                  data-for={ 'fab-reset-parameters' }
                  mini={ true }
                  onTouchTap={ this.props.resetParameters }
                  style={ {
                    margin: '20px 0px 0px 15px',
                  } }
                >
                  <Cached />
                </FloatingActionButton>
                <ReactTooltip
                  effect="solid"
                  id="fab-reset-parameters"
                  type="dark"
                  place="top"
                >
                  Reset parameters
                </ReactTooltip>
              </div>
            </div>
            <div
              style={ Object.assign(
                {},
                this.props.screenSize.isSmall ?
                analysisStyle.helpBoxSubSmall
                :
                analysisStyle.helpBoxSub,
                {
                  marginTop: 20,
                }
              ) }
            >
              Sample design
            </div>
            <SampleGrid
              availableSamples={ this.props.availableSamples }
              selected={ this.props.selected }
            />
          </div>
        }
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.help }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
          {
            this.props.dialog.defaultValue &&
            <div
              style={ {
                marginTop: 10,
              } }
            >
              Default: { String(this.props.dialog.defaultValue) }
            </div>
          }
        </Dialog>
      </div>
    );
  }
}

DesignAnalysis.propTypes = {
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
  formData: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  resetParameters: PropTypes.func.isRequired,
  screenSize: PropTypes.shape({
    isLarge: PropTypes.bool,
    isSmall: PropTypes.bool,
  }).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired,
};

export default muiThemeable()(DesignAnalysis);
