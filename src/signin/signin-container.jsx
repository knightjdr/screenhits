import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import GoogleAPI from './google/google-api';
import Signin from './signin';
import { login, signout } from '../state/get/signin-actions';
import { clearToken } from '../state/set/token-actions';

class SigninContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signinText: this.props.signedIn ? 'Sign out' : 'Sign in',
    };
  }
  componentDidMount = () => {
    window.addEventListener('load', this.onload);
  }
  componentWillReceiveProps = (nextProps) => {
    const { signedIn, signInFailed } = nextProps;
    this.updateSignin(signedIn, this.props.signedIn, signInFailed);
  }
  componentWillUnmount = () => {
    window.removeEventListener('load', this.onload);
  }
  onload = () => {
    GoogleAPI.authInit();
  }
  signin = () => {
    if (!this.props.signedIn) {
      GoogleAPI.signin()
        .then((signinToken) => {
          this.props.login(signinToken);
        })
        .catch((error) => {
          GoogleAPI.signout();
          if (error) {
            this.setState({
              dialog: {
                isOpen: true,
                message: error,
              },
            });
          }
        })
      ;
    } else {
      GoogleAPI.signout();
      this.props.clearToken();
      this.props.logout();
    }
  }
  updateSignin = (currentStatus, lastStatus, failed) => {
    if (failed) {
      GoogleAPI.signout();
    } else if (currentStatus !== lastStatus) {
      this.setState({
        signinText: currentStatus ? 'Sign out' : 'Sign in',
      });
    }
  }
  render() {
    return (
      <Signin
        dialog={ Object.assign(
          {},
          this.state.dialog,
          {
            close: this.dialogClose,
          }
        ) }
        signin={ this.signin }
        signinText={ this.state.signinText }
      />
    );
  }
}

SigninContainer.defaultProps = {
  signInStatus: '',
};

SigninContainer.propTypes = {
  clearToken: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  signedIn: PropTypes.bool.isRequired,
  signInFailed: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearToken: () => {
      dispatch(clearToken());
    },
    login: (token) => {
      dispatch(login(token));
    },
    logout: () => {
      dispatch(signout());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.user.signedIn,
    signInFailed: state.user.signInFailed,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninContainer);

export default Container;
