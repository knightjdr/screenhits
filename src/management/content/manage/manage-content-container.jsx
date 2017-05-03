import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { userGet } from '../../../state/get/user-actions';

import ManageContent from './manage-content';

class ManageContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        permission: this.props.permission,
      },
    };
    this.props.userGet(this.props.user, this.props.selected, this.props.lab, this.props.permission);
  }
  render() {
    return (
      <ManageContent
        formData={ this.state.formData }
        name={ this.props.name }
        selected={ this.props.selected }
        users={ this.props.users }
      />
    );
  }
}

ManageContentContainer.propTypes = {
  // cancel: PropTypes.func.isRequired,
  lab: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
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
