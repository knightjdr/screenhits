import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Navbar from './navbar';

const Links = {
  loggedIn: [
    {
      link: '/management/hierarchy',
      name: 'Management',
    },
    {
      link: '/analysis',
      name: 'Analysis',
    },
    {
      link: '/help',
      name: 'Help',
    },
  ],
  standard: [
    {
      link: '/help',
      name: 'Help',
    },
  ],
};

class NavbarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: this.props.signedIn ? Links.loggedIn : Links.standard,
      list: window.innerWidth > 680 ? 'horizontal' : 'compact',
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { signedIn } = nextProps;
    this.getLinks(signedIn, this.props.signedIn);
  }
  getLinks = (currentStatus, lastStatus) => {
    if (currentStatus !== lastStatus) {
      this.setState({
        links: currentStatus ? Links.loggedIn : Links.standard,
      });
    }
  }
  resize = () => {
    this.setState({
      list: window.innerWidth > 680 ? 'horizontal' : 'compact',
    });
  }
  render() {
    return (
      <Navbar
        links={ this.state.links }
        list={ this.state.list }
        resize={ this.resize }
      />
    );
  }
}

NavbarContainer.propTypes = {
  signedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.userTest.signedIn,
  };
};

const Container = connect(
  mapStateToProps,
)(NavbarContainer);

export default Container;
