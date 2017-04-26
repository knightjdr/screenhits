import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import ManagementSelection from 'root/management/selection/management-selection-container.js';
import ManagementContent from 'root/management/content/management-content-container.js';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import 'root/management/management.scss';

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'project',
      showList: false,
      viewIcon: 'sitemap',
      viewType: 'hierarchy'
    }
  }
  componentWillReceiveProps = (nextProps) => {
    let path = 'management/';
    if(nextProps.selected.project) {
      path += 'project:' + nextProps.selected.project;
      if(nextProps.selected.screen) {
        path += '/screen:' + nextProps.selected.screen;
        if(nextProps.selected.experiment) {
          path += '/experiment:' + nextProps.selected.experiment;
          if(nextProps.selected.sample) {
            path += '/sample:' + nextProps.selected.sample;
          }
        }
      }
    }
    //console.log(path);
    //browserHistory.push(path)
  }
  hideList = () => {
    this.setState({
      showList: false
    });
  }
  showList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true
    });
  }
  setActive = (type) => {
    this.setState({activeTab: type});
    if(this.state.showList) {
      this.setState({
        showList: false
      });
    }
  }
  setView = () => {
    if(this.state.viewType === 'hierarchy') {
      this.setState({viewIcon: 'list', viewType: 'list'});
    } else {
      this.setState({viewIcon: 'sitemap', viewType: 'hierarchy'});
    }
  }
  render () {
    return (
      <div className="management-wrapper">
        <div className="management-bar">
          <FlatButton
            className="management-view-button"
            data-tip
            data-for='viewType'
            icon={<FontAwesome name={this.state.viewIcon} />}
            onClick={this.setView}
          />
          <ReactTooltip id='viewType' effect='solid' type='dark' place="right">
            <span>Toggle view</span>
          </ReactTooltip>
          {this.state.viewType === 'hierarchy' ?
            <span>
              { this.props.available.project.items.length === 0 ? null :
                <span onClick={() => this.setActive('project')}>
                <ManagementSelection active={this.state.activeTab} details={this.props.available.project} type="project" selected={this.props.selected.project} />
                </span>
              }
              { !this.props.selected.project ? null :
                <span onClick={() => this.setActive('screen')}>
                <ManagementSelection active={this.state.activeTab} details={this.props.available.screen} type="screen" selected={this.props.selected.screen} />
                </span>
              }
              { !this.props.selected.screen ? null :
                <span onClick={() => this.setActive('experiment')}>
                <ManagementSelection active={this.state.activeTab} details={this.props.available.experiment} type="experiment" selected={this.props.selected.experiment} />
                </span>
              }
              { !this.props.selected.experiment ? null :
                <span onClick={() => this.setActive('sample')}>
                <ManagementSelection active={this.state.activeTab} details={this.props.available.sample} type="sample" selected={this.props.selected.sample} />
                </span>
              }
            </span>
            :
            <span className="management-list-view">
              <RaisedButton
                className="management-list-select"
                label={this.state.activeTab ? this.state.activeTab + 's' : 'Level:'}
                onClick={this.showList}
              />
              <Popover
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                animation={PopoverAnimationVertical}
                className="management-selection-popover"
                onRequestClose={this.hideList}
                open={this.state.showList}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}>
                <Menu>
                <MenuItem
                  key="project"
                  onClick={() => this.setActive('project')}
                  primaryText={[<FontAwesome key="project" name="folder-open" />, ' projects']}
                />
                <MenuItem
                  key="screen"
                  onClick={() => this.setActive('screen')}
                  primaryText={[<FontAwesome key="screen" name="braille" />, ' screens']}
                />
                <MenuItem
                  key="experiment"
                  onClick={() => this.setActive('experiment')}
                  primaryText={[<FontAwesome key="experiment" name="bar-chart" />, ' experiments']}
                />
                <MenuItem
                  key="sample"
                  onClick={() => this.setActive('sample')}
                  primaryText={[<FontAwesome key="sample" name="flask" />, ' samples']}
                />
                </Menu>
              </Popover>
            </span>
          }
        </div>
        <div className="management-content">
          <ManagementContent active={this.state.activeTab} selected={this.props.selected[this.state.activeTab]}/>
        </div>
      </div>
    );
  }
}

Management.propTypes = {
  available: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object.isRequired
};

export default Management;
