import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { manageUsers, resetPost } from '../../../state/post/project-manage-actions';
import { userGet } from '../../../state/get/project-user-actions';
import { userSearch } from '../../../state/get/search-user-actions';

import ManageContent from './manage-content';

const inputLabel = {
  lab: 'Search by lab',
  name: 'Search by user name',
};

const searchLabel = {
  full: 'Search',
  short: <FontAwesome name="search" />,
};
const smallButtonWidth = 50;
const smallButtonStyle = {
  maxWidth: smallButtonWidth,
  minWidth: smallButtonWidth,
  width: smallButtonWidth,
};

const tabNames = {
  full: {
    current: 'Current users',
    manage: 'Manage Users',
  },
  short: {
    current: <FontAwesome key="current" name="user" />,
    manage: <FontAwesome key="manage" name="user-plus" />,
  },
};

class ManageContentContainer extends React.Component {
  constructor(props) {
    super(props);
    const tableHeight = this.getHeight();
    this.state = {
      anchorEl: null,
      formData: {
        input: '',
        permission: this.props.permission,
      },
      inputLabel: inputLabel.name,
      inputType: 'name',
      searchLabel: window.innerWidth > 680 ? searchLabel.full : searchLabel.short,
      searchStyle: window.innerWidth > 680 ? {} : smallButtonStyle,
      tableHeight,
      tabNames: window.innerWidth > 680 ? tabNames.full : tabNames.short,
      users: {},
      userPopover: {},
    };
    this.props.userGet(this.props.user, this.props.selected, this.props.lab, this.props.permission);
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.props.userGet(nextProps.user, nextProps.selected, nextProps.lab, nextProps.permission);
    }
    if (nextProps.users._id &&
      nextProps.users._id !== this.state.users._id &&
      nextProps.users.list.length > 0
    ) {
      this.updateUsers(nextProps.users);
    }
  }
  componentWillUnmount() {
    this.props.resetPost();
    window.removeEventListener('resize', this.resize);
  }
  getHeight = () => {
    // 95 is the distance between the container and table top
    const top = this.props.top() + 95;
    // 70 is for some bottom padding
    return window.innerHeight - top - 70;
  }
  setSearchType = (type) => {
    this.setState({
      inputLabel: inputLabel[type],
      inputType: type,
    });
  }
  closePopover = (key) => {
    const userPopover = this.state.userPopover;
    userPopover[key] = false;
    this.setState({
      anchorEl: null,
      userPopover,
    });
  }
  inputChange = (field, value) => {
    const stateObject = this.state.formData;
    stateObject[field] = value;
    this.setState({ formData: stateObject });
  }
  menuClickPermission = (email, perm) => {
    const index = this.state.users.list.findIndex((obj) => { return obj.email === email; });
    const usersUpdate = JSON.parse(JSON.stringify(this.state.users));
    usersUpdate.list[index].permission = perm;
    this.setState({
      users: usersUpdate,
    });
    this.closePopover(email);
  }
  openPopover = (target, key, permission) => {
    if (permission !== 'o') {
      const userPopover = this.state.userPopover;
      userPopover[key] = true;
      this.setState({
        anchorEl: target,
        userPopover,
      });
    }
  }
  resetManage = () => {
    this.setState({
      users: this.props.users,
    });
  }
  resize = () => {
    this.searchStyle();
    this.tabNames();
    this.setState({
      tableHeight: this.getHeight(),
    });
  }
  search = () => {
    if (this.state.formData.input) {
      const queryString = `type=${this.state.inputType}&${this.state.inputType}=${this.state.formData.input}`;
      this.props.userSearch(this.props.user, this.props.selected, queryString);
    }
  }
  searchStyle = () => {
    this.setState({
      searchLabel: window.innerWidth > 680 ? searchLabel.full : searchLabel.short,
      searchStyle: window.innerWidth > 680 ? {} : smallButtonStyle,
    });
  }
  tabNames = () => {
    this.setState({
      tabNames: window.innerWidth > 680 ? tabNames.full : tabNames.short,
    });
  }
  updateManage = (type) => {
    const submitObj = {};
    if (type === 'current') {
      submitObj._id = this.props.selected;
      submitObj.list = this.state.users.list;
      submitObj.type = type;
    }
    this.props.manageUsers(
      this.props.user,
      this.props.selected,
      this.props.lab,
      submitObj,
      this.props.permission)
    ;
  }
  updateUsers = (users) => {
    const userPopover = {};
    users.list.forEach((user) => {
      userPopover[user.email] = false;
    });
    this.setState({
      users: JSON.parse(JSON.stringify(users)),
      userPopover,
    });
  }
  render() {
    return (
      <ManageContent
        anchorEl={ this.state.anchorEl }
        calcPageLength={ this.calcPageLength }
        cancel={ this.props.cancel }
        closePopover={ this.closePopover }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputLabel={ this.state.inputLabel }
        manageState={ this.props.manageState }
        menuClickPermission={ this.menuClickPermission }
        name={ this.props.name }
        openPopover={ this.openPopover }
        resetManage={ this.resetManage }
        search={ this.search }
        searchLabel={ this.state.searchLabel }
        searchUser={ this.props.searchUser }
        searchStyle={ this.state.searchStyle }
        setSearchType={ this.setSearchType }
        selected={ this.props.selected }
        tableHeight={ this.state.tableHeight }
        tabNames={ this.state.tabNames }
        updateManage={ this.updateManage }
        userPopover={ this.state.userPopover }
        users={ this.state.users }
      />
    );
  }
}

ManageContentContainer.propTypes = {
  cancel: PropTypes.func.isRequired,
  lab: PropTypes.string.isRequired,
  manageState: PropTypes.shape({
    didPostFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.number,
    isPost: PropTypes.bool,
  }).isRequired,
  manageUsers: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
  resetPost: PropTypes.func.isRequired,
  searchUser: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
  selected: PropTypes.number.isRequired,
  top: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  userGet: PropTypes.func.isRequired,
  userSearch: PropTypes.func.isRequired,
  users: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    manageUsers: (user, _id, lab, obj, permission) => {
      dispatch(manageUsers(user, _id, lab, obj, permission));
    },
    resetPost: () => {
      dispatch(resetPost(null));
    },
    userGet: (user, _id, lab, permission) => {
      dispatch(userGet(user, _id, lab, permission));
    },
    userSearch: (user, _id, queryString) => {
      dispatch(userSearch(user, _id, queryString));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    manageState: state.manage,
    searchUser: state.searchUser,
    user: state.user,
    users: state.users,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageContentContainer);

export default Container;
