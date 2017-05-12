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
  create = () => {
    this.hideManagementList();
    this.props.funcs.create();
  }
  edit = () => {
    this.hideManagementList();
    this.props.funcs.edit();
  }
  hideManagementList = () => {
    this.setState({
      showList: false,
    });
  }
  manage = () => {
    this.hideManagementList();
    this.props.funcs.manage();
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
        active={ this.props.active }
        anchorEl={ this.state.anchorEl }
        create={ this.create }
        edit={ this.edit }
        hideManagementList={ this.hideManagementList }
        manage={ this.manage }
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
  active: PropTypes.string.isRequired,
  funcs: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    manage: PropTypes.func,
  }).isRequired,
  selected: PropTypes.number,
};

export default ManagementMenuContent;
