import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import GoogleAPI from './google/google-api';
import { login, logout } from '../state/post/signin-actions';
import Signin from './signin';

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
    const { user } = nextProps;
    this.updateSignin(user.signedIn, this.props.user.signedIn);
  }
  signin = () => {
    if (!this.props.user.signedIn) {
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
          this.props.logout(this.props.user.email, this.props.user.token);
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
  updateSignin = (newStatus, lastStatus) => {
    if (newStatus !== lastStatus) {
      this.setState({
        signinText: newStatus ? 'Sign out' : 'Sign in',
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
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    signedIn: PropTypes.bool,
    token: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (token) => {
      dispatch(login(token));
    },
    logout: (email, token) => {
      dispatch(logout(email, token));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.userTest,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninContainer);

export default Container;
