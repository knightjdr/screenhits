import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import '../assets/font-awesome/font-awesome.css';
import './compact-ref-list.scss';

export default class CompactRefList extends React.Component {
  render() {
    let menuPosition = {
      right: '5px',
      top: '5px',
    };
    if (this.props.anchor === 'topRight') {
      menuPosition = {
        right: '5px',
        top: '5px',
      };
    }
    return (
      <div className="compact-list">
        <button
          className="compact-list-button"
          onClick={ this.props.showMenu }
        >
          <FontAwesome name="list" />
        </button>
        { !this.props.viewMenu ? null :
        <button
          className="compact-backdrop"
          onClick={ this.props.closeBackdrop }
        >
          <div
            className="compact-menu"
            style={ menuPosition }
          >
            <ul className="vertical-list">
              { this.props.items.map((item) => {
                return (
                  <Link key={ item.link } to={ item.link }>
                    <li>
                      { item.name }
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </button>
        }
      </div>
    );
  }
}

CompactRefList.propTypes = {
  anchor: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  closeBackdrop: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
  viewMenu: PropTypes.bool.isRequired,
};
