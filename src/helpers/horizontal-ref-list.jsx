import React from 'react';

import './horizontal-ref-list.scss';

export default class HorizontalRefList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <ul className="horizontal-list">
        {this.props.items.map((item) => (
          <li key={item.link}>
          </li>
        ))}
      </ul>
    )
  }
}
