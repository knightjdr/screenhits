import React from 'react';

import Navbar from './navbar';

class NavbarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: window.innerWidth > 680 ? 'horizontal' : 'compact',
    };
  }
  resize = () => {
    this.setState({
      list: window.innerWidth > 680 ? 'horizontal' : 'compact',
    });
  }
  render() {
    return (
      <Navbar
        list={ this.state.list }
        resize={ this.resize }
      />
    );
  }
}

export default NavbarContainer;
