import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import ManagementSelection from './selection/management-selection-container';
import ManagementContent from './content/management-content-container';

import './management.scss';

class Management extends React.Component {
  render() {
    return (
      <div className="management-wrapper">
        <div className="management-bar">
          <FlatButton
            className="management-view-button"
            data-tip={ true }
            data-for="viewType"
            icon={ <FontAwesome name={ this.props.viewIcon } /> }
            onClick={ this.props.changeView }
          />
          <ReactTooltip id="viewType" effect="solid" type="dark" place="right">
            <span>Toggle view</span>
          </ReactTooltip>
          { this.props.viewType === 'hierarchy' ?
            <span>
              { this.props.available.project.items.length >= 0 ||
                this.props.available.project.isFetching ?
                  <ManagementSelection
                    active={ this.props.activeTab }
                    details={ this.props.available.project }
                    onClick={ () => { this.props.changeActive('project'); } }
                    type="project"
                    selected={ this.props.selected.project }
                  />
                :
                null
              }
              { !this.props.selected.project ? null :
              <ManagementSelection
                active={ this.props.activeTab }
                details={ this.props.available.screen }
                onClick={ () => { this.props.changeActive('screen'); } }
                type="screen"
                selected={ this.props.selected.screen }
              />
              }
              { !this.props.selected.screen ? null :
              <ManagementSelection
                active={ this.props.activeTab }
                details={ this.props.available.experiment }
                onClick={ () => { this.props.changeActive('experiment'); } }
                type="experiment"
                selected={ this.props.selected.experiment }
              />
              }
              { !this.props.selected.experiment ? null :
              <ManagementSelection
                active={ this.props.activeTab }
                details={ this.props.available.sample }
                onClick={ () => { this.props.changeActive('sample'); } }
                type="sample"
                selected={ this.props.selected.sample }
              />
              }
            </span>
            :
            <span className="management-list-view">
              <RaisedButton
                className="management-list-select"
                label={ this.props.activeTab ? `${this.props.activeTab}s` : 'Level:' }
                onClick={ this.props.showList }
              />
              <Popover
                anchorEl={ this.props.anchorEl }
                anchorOrigin={ {
                  horizontal: 'left',
                  vertical: 'top',
                } }
                animation={ PopoverAnimationVertical }
                className="management-selection-popover"
                onRequestClose={ this.props.hideList }
                open={ this.props.showList }
                targetOrigin={ {
                  horizontal: 'left',
                  vertical: 'top',
                } }
              >
                <Menu>
                  <MenuItem
                    key="project"
                    onClick={ () => { this.props.changeActive('project'); } }
                    primaryText={ [<FontAwesome key="project" name="folder-open" />, ' projects'] }
                  />
                  <MenuItem
                    key="screen"
                    onClick={ () => { this.props.changeActive('screen'); } }
                    primaryText={ [<FontAwesome key="screen" name="braille" />, ' screens'] }
                  />
                  <MenuItem
                    key="experiment"
                    onClick={ () => { this.props.changeActive('experiment'); } }
                    primaryText={ [<FontAwesome key="experiment" name="bar-chart" />, ' experiments'] }
                  />
                  <MenuItem
                    key="sample"
                    onClick={ () => { this.props.changeActive('sample'); } }
                    primaryText={ [<FontAwesome key="sample" name="flask" />, ' samples'] }
                  />
                </Menu>
              </Popover>
            </span>
          }
        </div>
        <div className="management-content">
          <ManagementContent
            active={ this.props.activeTab }
            selected={ this.props.selected[this.props.activeTab] }
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
  activeTab: PropTypes.string.isRequired,
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
  changeActive: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  hideList: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }),
  showList: PropTypes.func.isRequired,
  viewIcon: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default Management;
