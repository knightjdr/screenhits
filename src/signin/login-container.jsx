import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';

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
    const { isSigningIn, location, signInFailed, signInStatus } = nextProps;
    this.updateSignin(isSigningIn, signInFailed, signInStatus, location.pathname);
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        isOpen: false,
        message: '',
      },
    });
  }
  updateSignin = (isSigningIn, failed, signInStatus, path) => {
    // currently not displaying a dialog when signing in
    if (
      failed &&
      path !== '/' &&
      path !== '/help'
    ) {
      browserHistory.push('/');
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
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

export default withRouter(Container);
