import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
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
          height: 'calc(100vh - 65px)',
          padding: '0px 2px 5px 2px',
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
            icon={ <FontAwesome name={ this.props.viewIcon } /> }
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
          { this.props.viewType === 'hierarchy' ?
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
            :
            <span
              style={ {
                marginLeft: 2,
              } }
            >
              <RaisedButton
                backgroundColor={ this.props.muiTheme.palette.alternativeButtonColor }
                label={ this.props.activeLevel ? `${this.props.activeLevel}s` : 'Level:' }
                onClick={ this.props.showList }
              />
              <Popover
                anchorEl={ this.props.anchorEl }
                anchorOrigin={ {
                  horizontal: 'left',
                  vertical: 'top',
                } }
                animation={ PopoverAnimationVertical }
                onRequestClose={ this.props.hideList }
                open={ this.props.showListBoolean }
                targetOrigin={ {
                  horizontal: 'left',
                  vertical: 'top',
                } }
              >
                <Menu
                  style={ {
                    paddingBottom: 0,
                    paddingTop: 0,
                  } }
                >
                  <MenuItem
                    key="project"
                    onClick={ this.changeProjectLevel }
                    primaryText={ [<FontAwesome key="project" name="folder-open" />, ' projects'] }
                  />
                  <MenuItem
                    key="screen"
                    onClick={ this.changeScreenLevel }
                    primaryText={ [<FontAwesome key="screen" name="braille" />, ' screens'] }
                  />
                  <MenuItem
                    key="experiment"
                    onClick={ this.changeExperimentLevel }
                    primaryText={ [<FontAwesome key="experiment" name="bar-chart" />, ' experiments'] }
                  />
                  <MenuItem
                    key="sample"
                    onClick={ this.changeSampleLevel }
                    primaryText={ [<FontAwesome key="sample" name="flask" />, ' samples'] }
                  />
                </Menu>
              </Popover>
            </span>
          }
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
  anchorEl: PropTypes.shape({
  }),
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
  hideList: PropTypes.func.isRequired,
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
  showList: PropTypes.func.isRequired,
  showListBoolean: PropTypes.bool.isRequired,
  viewIcon: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default muiThemeable()(Management);
