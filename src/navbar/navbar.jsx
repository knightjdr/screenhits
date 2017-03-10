import CompactRefList from 'root/lists/compact-ref-list.jsx';
import Details from 'root/navbar/navbar-details.json';
import HorizontalRefList from 'root/lists/horizontal-ref-list.jsx';
import React from 'react';

import 'root/navbar/navbar.scss';

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
