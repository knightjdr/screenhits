import PropTypes from 'prop-types';
import React from 'react';

import CompactRefList from './compact-ref-list';

export default class CompactRefListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMenu: false,
    };
  }
  closeBackdrop = () => {
    this.setState({
      viewMenu: false,
    });
  }
  showMenu = () => {
    this.setState((prevState) => {
      return ({
        viewMenu: !prevState.viewMenu,
      });
    });
  }
  render() {
    return (
      <CompactRefList
        anchor={ this.props.anchor }
        items={ this.props.items }
        closeBackdrop={ this.closeBackdrop }
        showMenu={ this.showMenu }
        viewMenu={ this.state.viewMenu }
      />
    );
  }
}

CompactRefListContainer.propTypes = {
  anchor: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
};
