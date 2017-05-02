import PropTypes from 'prop-types';
import React from 'react';

import Navbar from './navbar/navbar';

import './style/normalize.css';
import './style/fonts.scss';
import './app.scss';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
