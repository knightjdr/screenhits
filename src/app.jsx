import PropTypes from 'prop-types';
import React from 'react';

import Navbar from './navbar/navbar-container';

import './assets/font-awesome/font-awesome.css';
import './style/normalize.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div
          style={ {
            height: 'calc(100vh - 70px)',
            marginTop: 60,
            zIndex: 1,
          } }
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
