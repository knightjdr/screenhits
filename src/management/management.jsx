import { browserHistory } from 'react-router';
import ManagementSelection from 'root/management/selection/management-selection-container.js';
import ManagementContent from 'root/management/content/management-content-container.js';
import React from 'react';

import 'root/management/management.scss';

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'project'
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
  setActive = (type) => {
    this.setState({activeTab: type});
  }
  render () {
    return (
      <div className="management-wrapper">
        <div className="management-bar">
          { this.props.available.projects.length === 0 ? null :
            <span className="management-tab-wrapper" onClick={() => this.setActive('project')}>
            <ManagementSelection active={this.state.activeTab} details={this.props.available.projects} type="project" selected={this.props.selected.project} />
            </span>
          }
          { !this.props.selected.project ? null :
            <span className="management-tab-wrapper" onClick={() => this.setActive('screen')}>
            <ManagementSelection active={this.state.activeTab} details={this.props.available.screens} type="screen" selected={this.props.selected.screen} />
            </span>
          }
          { !this.props.selected.screen ? null :
            <span className="management-tab-wrapper" onClick={() => this.setActive('experiment')}>
            <ManagementSelection active={this.state.activeTab} details={this.props.available.experiments} type="experiment" selected={this.props.selected.experiment} />
            </span>
          }
          { !this.props.selected.experiment ? null :
            <span className="management-tab-wrapper" onClick={() => this.setActive('sample')}>
            <ManagementSelection active={this.state.activeTab} details={this.props.available.samples} type="sample" selected={this.props.selected.sample} />
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
