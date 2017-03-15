import { browserHistory } from 'react-router';
import ManagementSelection from 'root/management/selection/management-selection-container.js';
import React from 'react';

import 'root/management/management.scss';

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: {
        experiment: false,
        project: true,
        sample: false,
        screen: false
      }
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
    console.log(path);
    //browserHistory.push(path)
  }
  setActive = (type) => {
    let newTabState = {
      experiment: false,
      project: false,
      sample: false,
      screen: false
    };
    newTabState[type] = true;
    this.setState({
      activeTab: newTabState
    });
  }
  render () {
    const experiments = [
      {
        _id: 1,
        name: 'Some experiment'
      },
      {
        _id: 2,
        name: 'Some other experiment'
      }
    ];
    const projects = [
      {
        _id: 1,
        name: 'Some project'
      },
      {
        _id: 2,
        name: 'Some other project'
      }
    ];
    const samples = [
      {
        _id: 1,
        name: 'Some sample'
      },
      {
        _id: 2,
        name: 'Some other sample'
      }
    ];
    const screens = [
      {
        _id: 1,
        name: 'Some screen'
      },
      {
        _id: 2,
        name: 'Some other screen'
      }
    ];
    return (
      <div className="management-bar">
        { !this.props.selected.project ? null :
          <span className="management-tab-wrapper" onClick={() => this.setActive('project')}>
            <ManagementSelection active={this.state.activeTab.project} details={projects} type="project" selected={this.props.selected.project} />
          </span>
        }
        { !this.props.selected.screen ? null :
          <span className="management-tab-wrapper" onClick={() => this.setActive('screen')}>
            <ManagementSelection active={this.state.activeTab.screen} details={screens} type="screen" selected={this.props.selected.screen} />
          </span>
        }
        { !this.props.selected.experiment ? null :
          <span className="management-tab-wrapper" onClick={() => this.setActive('experiment')}>
            <ManagementSelection active={this.state.activeTab.experiment} details={experiments} type="experiment" selected={this.props.selected.experiment} />
          </span>
        }
        { !this.props.selected.sample ? null :
          <span className="management-tab-wrapper" onClick={() => this.setActive('sample')}>
            <ManagementSelection active={this.state.activeTab.sample} details={samples} type="sample" selected={this.props.selected.sample} />
          </span>
        }
      </div>
    );
  }
}

Management.propTypes = {
  selected: React.PropTypes.object.isRequired
};

export default Management;
