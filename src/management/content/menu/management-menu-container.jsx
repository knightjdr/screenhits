import PropTypes from 'prop-types';
import React from 'react';

import ManagementMenu from './management-menu';

class ManagementMenuContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      showList: false,
    };
  }
  createMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.create();
  }
  editMenuAction = () => {
    this.hideManagementList();
    this.props.menuActions.edit();
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
  showManagementList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  render() {
    return (
      <ManagementMenu
        activeLevel={ this.props.activeLevel }
        anchorEl={ this.state.anchorEl }
        createMenuAction={ this.createMenuAction }
        editMenuAction={ this.editMenuAction }
        hideManagementList={ this.hideManagementList }
        manageMenuAction={ this.manageMenuAction }
        selected={ this.props.selected }
        showList={ this.state.showList }
        showManagementList={ this.showManagementList }
      />
    );
  }
}

ManagementMenuContent.defaultProps = {
  selected: null,
};

ManagementMenuContent.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  menuActions: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    manage: PropTypes.func,
  }).isRequired,
  selected: PropTypes.number,
};

export default ManagementMenuContent;