import ProjectSelection from 'root/projects/selection/project-selection-container.js';
import React from 'react';

import 'root/projects/projects.scss';

class Projects extends React.Component {
  constructor(props) {
    super(props);
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
      <div className="project-bar">
        { !this.props.selected.project ? null :
          <ProjectSelection details={projects} type="project" selected={this.props.selected.project} />
        }
        { !this.props.selected.screen ? null :
          <ProjectSelection details={screens} type="screen" selected={this.props.selected.screen} />
        }
        { !this.props.selected.experiment ? null :
          <ProjectSelection details={experiments} type="experiment" selected={this.props.selected.experiment} />
        }
        { !this.props.selected.sample ? null :
          <ProjectSelection details={samples} type="sample" selected={this.props.selected.sample} />
        }
      </div>
    );
  }
}

Projects.propTypes = {
  selected: React.PropTypes.object.isRequired
};

export default Projects;
