import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { userGet } from '../../../state/get/user-actions';

import ManageContent from './manage-content';

class ManageContentContainer extends React.Component {
  constructor(props) {
    super(props);
    // 48 is for the padding + heading + margins
    const top = this.props.top() + 48;
    // 48 = tab, 59 = table head, 51 = table foot
    const tableHeight = window.innerHeight - top - 48 - 59 - 51;
    this.state = {
      anchorEl: null,
      formData: {
        permission: this.props.permission,
      },
      page: 0,
      pageLength: Math.floor(tableHeight / 50),
      pageTotal: 0,
      users: {},
      userPopover: {},
      usersPage: [],
    };
    this.props.userGet(this.props.user, this.props.selected, this.props.lab, this.props.permission);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.list.length > 0) {
      const userPopover = {};
      nextProps.users.list.forEach((user) => {
        userPopover[user.email] = false;
      });
      this.setState({
        pageTotal: Math.ceil(nextProps.users.list.length / this.state.pageLength) - 1,
        users: nextProps.users,
        userPopover,
        usersPage: nextProps.users.list.slice(
          this.state.page * this.state.pageLength,
          (this.state.page * this.state.pageLength) + this.state.pageLength)
        ,
      });
    }
  }
  closePopover = (key) => {
    const userPopover = this.state.userPopover;
    userPopover[key] = false;
    this.setState({
      anchorEl: null,
      userPopover,
    });
  }
  menuClickPermission = (email, perm) => {
    const index = this.state.users.list.findIndex((obj) => { return obj.email === email; });
    const usersUpdate = this.state.users;
    usersUpdate.list[index].permission = perm;
    this.setState({
      users: usersUpdate,
    });
    this.closePopover(email);
  }
  openPopover = (event, key) => {
    const userPopover = this.state.userPopover;
    userPopover[key] = true;
    this.setState({
      anchorEl: event.target,
      userPopover,
    });
  }
  pageDown = () => {
    this.setState((prevState) => {
      if (prevState.page > 0) {
        return {
          page: prevState.page - 1,
          usersPage: this.props.users.list.slice(
            (prevState.page - 1) * prevState.pageLength,
            ((prevState.page - 1) * prevState.pageLength) + prevState.pageLength)
          ,
        };
      }
      return {};
    });
  }
  pageUp = () => {
    this.setState((prevState) => {
      if (prevState.page < prevState.pageTotal) {
        return {
          page: prevState.page + 1,
          usersPage: this.props.users.list.slice(
            (prevState.page + 1) * prevState.pageLength,
            ((prevState.page + 1) * prevState.pageLength) + prevState.pageLength)
          ,
        };
      }
      return {};
    });
  }
  render() {
    return (
      <div
        ref={ (element) => { this.element = element; } }
      >
        <ManageContent
          anchorEl={ this.state.anchorEl }
          formData={ this.state.formData }
          closePopover={ this.closePopover }
          menuClickPermission={ this.menuClickPermission }
          name={ this.props.name }
          openPopover={ this.openPopover }
          page={ this.state.page }
          pageDown={ this.pageDown }
          pageTotal={ this.state.pageTotal }
          pageUp={ this.pageUp }
          selected={ this.props.selected }
          users={ this.state.users }
          userPopover={ this.state.userPopover }
          usersPage={ this.state.usersPage }
        />
      </div>
    );
  }
}

ManageContentContainer.propTypes = {
  // cancel: PropTypes.func.isRequired,
  lab: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  top: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  userGet: PropTypes.func.isRequired,
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
    userGet: (user, _id, lab, permission) => {
      dispatch(userGet(user, _id, lab, permission));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageContentContainer);

export default Container;
