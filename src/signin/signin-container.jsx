import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import GoogleAPI from './google/google-api';
import Signin from './signin';
import { login, signout } from '../state/post/signin-actions';
import { clearToken } from '../state/set/token-actions';

class SigninContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        isOpen: false,
        message: '',
      },
      signinText: 'Sign in',
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { signedIn } = nextProps;
    this.updateSignin(signedIn, this.props.signedIn);
  }
  signin = () => {
    if (!this.props.signedIn) {
      GoogleAPI.signin()
        .then((token) => {
          this.props.login(token);
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
      GoogleAPI.signout()
        .then(() => {
          this.props.clearToken();
          this.props.logout();
        })
        .catch((error) => {
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
    }
  }
  updateSignin = (currentStatus, lastStatus) => {
    if (currentStatus !== lastStatus) {
      this.setState({
        signinText: currentStatus ? 'Sign out' : 'Sign in',
      });
    }
  }
  render() {
    return (
      <Signin
        signin={ this.signin }
        signinText={ this.state.signinText }
      />
    );
  }
}

SigninContainer.propTypes = {
  clearToken: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  signedIn: PropTypes.bool.isRequired,
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
    signedIn: state.userTest.signedIn,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninContainer);

export default Container;
