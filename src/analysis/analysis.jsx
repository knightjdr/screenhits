import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import AnalysisMenu from './menu/analysis-menu-container';
import Archive from './archive/archive-container';
import NewAnalysis from './new-analysis/new-analysis-container';
import GeneSearch from './gene-search/gene-search-container';

const chooseContainerStyle = {
  alignItems: 'center',
  borderRadius: 5,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
};
const containerStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
};
const radioButtonGroupStyle = {
  borderRadius: 5,
  margin: 10,
  padding: 5,
};
const radioButtonStyle = {
  margin: '5px 0px 5px 0px',
  width: 200,
};
const textBoxStyle = {
  alignItems: 'center',
  display: 'flex',
  fontSize: 20,
  justifyContent: 'center',
  maxWidth: 400,
  minHeight: 100,
  padding: 10,
  textAlign: 'center',
};
const viewHelp = {
  archive: 'Manage and view existing analyses',
  design: 'Perform new analysis or comparisons',
  search: 'Search for a gene and view associated results',
};

class Analysis extends React.Component {
  getView = (viewType) => {
    switch (viewType) {
      case 'archive':
        return (
          <Archive
            viewID={ this.props.viewID }
          />
        );
      case 'design':
        return <NewAnalysis />;
      case 'search':
        return <GeneSearch />;
      default:
        return (
          <div
            style={ containerStyle }
          >
            <div
              style={ Object.assign(
                {},
                chooseContainerStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.primary1Color,
                  color: this.props.muiTheme.palette.offWhite,
                }
              ) }
            >
              <RadioButtonGroup
                name="analysisView"
                defaultSelected={ this.props.highlightedView }
                style={ Object.assign(
                  {},
                  radioButtonGroupStyle,
                  {
                    backgroundColor: this.props.muiTheme.palette.offWhite,
                  }
                ) }
              >
                <RadioButton
                  label="New analysis"
                  onClick={ () => { this.props.highlightView('design'); } }
                  style={ radioButtonStyle }
                  value="design"
                />
                <RadioButton
                  label="Archive"
                  onClick={ () => { this.props.highlightView('archive'); } }
                  style={ radioButtonStyle }
                  value="archive"
                />
                <RadioButton
                  label="Gene search"
                  onClick={ () => { this.props.highlightView('search'); } }
                  style={ radioButtonStyle }
                  value="search"
                />
              </RadioButtonGroup>
              <div
                style={ Object.assign(
                  {},
                  textBoxStyle,
                  {
                    width: this.props.textWidth,
                  }
                ) }
              >
                <div>
                  { viewHelp[this.props.highlightedView] }
                </div>
              </div>
            </div>
            <div>
              <FlatButton
                backgroundColor={ this.props.muiTheme.palette.darkButtonColor }
                hoverColor={ this.props.muiTheme.palette.darkButtonColorHover }
                label="Next"
                onTouchTap={ () => { this.props.changeView(this.props.highlightedView); } }
                style={ {
                  marginTop: 20,
                  color: this.props.muiTheme.palette.offWhite,
                } }
              />
            </div>
          </div>
        );
    }
  }
  render() {
    return (
      <div
        style={ {
          height: '100%',
          padding: '0px 10px 5px 10px',
        } }
      >
        { this.getView(this.props.view) }
        { this.props.view &&
          <AnalysisMenu
            changeView={ this.props.changeView }
            view={ this.props.view }
          />
        }
      </div>
    );
  }
}

Analysis.defaultProps = {
  view: null,
  viewID: null,
};

Analysis.propTypes = {
  changeView: PropTypes.func.isRequired,
  highlightView: PropTypes.func.isRequired,
  highlightedView: PropTypes.string.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      darkButtonColor: PropTypes.string,
      darkButtonColorHover: PropTypes.string,
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
  textWidth: PropTypes.number.isRequired,
  view: PropTypes.string,
  viewID: PropTypes.number,
};

export default muiThemeable()(Analysis);
