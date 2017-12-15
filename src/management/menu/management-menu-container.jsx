import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ManagementMenu from './management-menu';
import Permissions from '../../helpers/permissions';
import { projectItemProp, selectedProp, userProp } from '../../types/index';

class ManagementMenuContainer extends React.Component {
  constructor(props) {
    super(props);
    const project = this.getProject(this.props.projects, this.props.selected.project);
    this.state = {
      anchorEl: null,
      canEdit: Permissions.canEditProject(this.props.user, project),
      canManage: Permissions.canManageProject(this.props.user, project),
      radius: 30,
      showList: false,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { projects, user, selected } = nextProps;
    this.updateProject(selected.project, this.props.selected.project, projects, user);
  }
  getProject = (projects, selectedProject) => {
    if (selectedProject) {
      const projectIndex = projects.findIndex((project) => {
        return project._id === selectedProject;
      });
      return projects[projectIndex];
    }
    return {};
  }
  createMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.create();
  }
  editMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.edit();
  }
  enlargeMenu = () => {
    this.setState({
      radius: 50,
    });
  }
  hideManagementList = () => {
    this.setState({
      showList: false,
    });
  }
  manageMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.manage();
  }
  protocolMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.protocol();
  }
  showManagementList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  shrinkMenu = () => {
    this.setState({
      radius: 30,
    });
  }
  updateMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.update();
  }
  updateProject = (newID, currentID, projects, user) => {
    if (
      newID &&
      newID !== currentID
    ) {
      const project = this.getProject(projects, newID);
      this.setState({
        canEdit: Permissions.canEditProject(user, project),
        canManage: Permissions.canManageProject(user, project),
      });
    } else if (
      newID !== currentID
    ) {
      this.setState({
        canEdit: false,
        canManage: false,
      });
    }
  }
  render() {
    return (
      <ManagementMenu
        activeLevel={ this.props.activeLevel }
        anchorEl={ this.state.anchorEl }
        canEdit={ this.state.canEdit }
        canManage={ this.state.canManage }
        createMenuAction={ this.createMenuAction }
        editMenuAction={ this.editMenuAction }
        enlargeMenu={ this.enlargeMenu }
        hideManagementList={ this.hideManagementList }
        manageMenuAction={ this.manageMenuAction }
        protocolMenuAction={ this.protocolMenuAction }
        radius={ this.state.radius }
        viewID={ this.props.viewID }
        showList={ this.state.showList }
        showManagementList={ this.showManagementList }
        shrinkMenu={ this.shrinkMenu }
        updateMenuAction={ this.updateMenuAction }
      />
    );
  }
}

ManagementMenuContainer.defaultProps = {
  viewID: null,
};

ManagementMenuContainer.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  menuActions: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    manage: PropTypes.func,
    protocol: PropTypes.func,
    update: PropTypes.func,
  }).isRequired,
  projects: projectItemProp.isRequired,
  selected: selectedProp.isRequired,
  user: userProp.isRequired,
  viewID: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {
    projects: state.available.project.items,
    selected: state.selected,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
)(ManagementMenuContainer);

export default Container;
