import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import GooglePlatformScript from './signin/google/script';
import Navbar from './navbar/navbar-container';

import Login from './signin/login-container';

import './assets/font-awesome/font-awesome.css';
import './style/normalize.css';

class App extends React.Component {
  componentDidMount() {
    GooglePlatformScript();
  }
  render() {
    return (
      <div
        style={ {
          color: this.props.muiTheme.palette.textColor,
        } }
      >
        <Navbar />
        <div
          style={ {
            height: 'calc(100vh - 70px)',
            marginTop: 60,
            zIndex: 1,
          } }
        >
          { this.props.children }
        </div>
        <Login />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      textColor: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(App);
