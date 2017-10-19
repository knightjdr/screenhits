import React from 'react';

import Signin from './signin';

class SigninContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: 'false',
      signinText: 'Sign in',
    };
  }
  changeSignin = () => {
    this.setState((prevState) => {
      return {
        isSignedIn: !prevState.isSignedIn,
        signinText: prevState.isSignedIn ? 'Sign out' : 'Sign in',
      };
    });
  }
  render() {
    return (
      <Signin
        changeSignin={ this.changeSignin }
        signinText={ this.state.signinText }
      />
    );
  }
}

export default SigninContainer;
