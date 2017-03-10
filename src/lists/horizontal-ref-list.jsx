import { Link } from 'react-router';
import React from 'react';

import 'root/lists/horizontal-ref-list.scss';

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
            <Link to={item.link}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    )
  }
}
