import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import ManagementSelection from './selection/management-selection-container';
import ManagementContent from './content/management-content-container';

class Management extends React.Component {
  changeExperimentLevel = () => {
    this.props.changeLevel('experiment');
  }
  changeProjectLevel = () => {
    this.props.changeLevel('project');
  }
  changeSampleLevel = () => {
    this.props.changeLevel('sample');
  }
  changeScreenLevel = () => {
    this.props.changeLevel('screen');
  }
  render() {
    return (
      <div
        style={ {
          display: 'flex',
          flexFlow: 'column',
          height: 'calc(100vh - 70px)',
          padding: '5px 2px 5px 2px',
          position: 'relative',
        } }
      >
        <div
          style={ {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginTop: 2,
          } }
        >
          <FlatButton
            backgroundColor={ this.props.muiTheme.palette.offWhite }
            data-tip={ true }
            data-for="viewType"
            icon={ <FontAwesome name="sitemap" /> }
            onClick={ this.props.changeView }
            style={ {
              border: `1px solid ${this.props.muiTheme.palette.darkButtonColor}`,
              color: this.props.muiTheme.palette.darkButtonColor,
              minWidth: 50,
              width: 50,
            } }
          />
          <ReactTooltip id="viewType" effect="solid" type="dark" place="right">
            <span>Toggle view</span>
          </ReactTooltip>
          <span>
            { this.props.available.project.items.length >= 0 ||
              this.props.available.project.isFetching ?
                <ManagementSelection
                  activeLevel={ this.props.activeLevel }
                  changeLevel={ this.props.changeLevel }
                  details={ this.props.available.project }
                  type="project"
                  selected={ this.props.selected.project }
                />
              :
              null
            }
            { !this.props.selected.project ? null :
            <ManagementSelection
              activeLevel={ this.props.activeLevel }
              changeLevel={ this.props.changeLevel }
              details={ this.props.available.screen }
              type="screen"
              selected={ this.props.selected.screen }
            />
            }
            { !this.props.selected.screen ? null :
            <ManagementSelection
              activeLevel={ this.props.activeLevel }
              changeLevel={ this.props.changeLevel }
              details={ this.props.available.experiment }
              type="experiment"
              selected={ this.props.selected.experiment }
            />
            }
            { !this.props.selected.experiment ? null :
            <ManagementSelection
              activeLevel={ this.props.activeLevel }
              changeLevel={ this.props.changeLevel }
              details={ this.props.available.sample }
              type="sample"
              selected={ this.props.selected.sample }
            />
            }
          </span>
        </div>
        <div
          style={ {
            display: 'flex',
            flex: '1 1 auto',
            paddingTop: 5,
          } }
        >
          <ManagementContent
            activeLevel={ this.props.activeLevel }
            selected={ this.props.selected }
          />
        </div>
      </div>
    );
  }
}

Management.defaultProps = {
  anchorEl: {},
  selected: null,
};

Management.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  available: PropTypes.shape({
    experiment: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    project: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    sample: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
    screen: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
        }),
      ),
      message: PropTypes.string,
    }),
  }).isRequired,
  changeLevel: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
      darkButtonColor: PropTypes.string,
      darkButtonColorHover: PropTypes.string,
      offWhite: PropTypes.string,
    }),
  }).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }),
};

export default muiThemeable()(Management);
