import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import './horizontal-ref-list.scss';

export default class HorizontalRefList extends React.Component {
  render() {
    return (
      <ul className="horizontal-list">
        { this.props.items.map((item) => {
          return (
            <li key={ item.link }>
              <Link to={ item.link }>
                { item.name }
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

HorizontalRefList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
};
