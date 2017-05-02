import React from 'react';

import CompactRefList from '../lists/compact-ref-list-container';
import Details from './navbar-details.json';
import HorizontalRefList from '../lists/horizontal-ref-list';

import './navbar.scss';

export default class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <img
          alt="ScreenHits logo"
          className="navbar-icon"
        />
        <span className="navbar-list">
          <HorizontalRefList
            items={ Details.links }
          />
          <CompactRefList
            anchor="topRight"
            items={ Details.links }
          />
        </span>
      </div>
    );
  }
}
