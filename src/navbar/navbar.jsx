import CompactRefList from '../helpers/compact-ref-list.jsx';
import HorizontalRefList from '../helpers/horizontal-ref-list.jsx';
import React from 'react';

import './navbar.scss';

const Details = {
  links: ['Home', 'Help']
}

export default class Navbar extends React.Component {
  render () {
    return (
      <div className="navbar">
        <img className="navbar-icon"/>
        <span className="navbar-list">
          <HorizontalRefList items={Details.links}/>
          <CompactRefList anchor="topRight" items={Details.links}/>
        </span>
      </div>
    );
  }
}
