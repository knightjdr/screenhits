import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Login from './login';
import Token from './token';
import { validateToken } from '../state/get/signin-actions';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        isOpen: false,
        message: '',
        title: '',
      },
    };
  }
  componentDidMount = () => {
    const authToken = Token.get();
    if (authToken) {
      this.props.validateToken(authToken);
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const { isSigningIn, signInFailed, signInStatus } = nextProps;
    this.updateSignin(isSigningIn, signInFailed, signInStatus);
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        isOpen: false,
        message: '',
      },
    });
  }
  updateSignin = (isSigningIn, failed, signInStatus) => {
    // currently not displaying a dialog when signing in
    if (failed) {
      this.setState({
        dialog: {
          isOpen: true,
          message: signInStatus,
          title: 'Login error',
        },
      });
    }
  }
  render() {
    return (
      <Login
        dialog={ Object.assign(
          {},
          this.state.dialog,
          {
            close: this.dialogClose,
          }
        ) }
      />
    );
  }
}

LoginContainer.defaultProps = {
  signInStatus: '',
};

LoginContainer.propTypes = {
  isSigningIn: PropTypes.bool.isRequired,
  signInFailed: PropTypes.bool.isRequired,
  signInStatus: PropTypes.string,
  validateToken: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateToken: (authToken) => {
      dispatch(validateToken(authToken));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    isSigningIn: state.userTest.isSigningIn,
    signInFailed: state.userTest.signInFailed,
    signInStatus: state.userTest.message,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);

export default Container;
