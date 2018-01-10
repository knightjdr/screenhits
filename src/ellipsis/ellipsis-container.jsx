import PropTypes from 'prop-types';
import React from 'react';

import Ellipsis from './ellipsis';

class EllipsisContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more: true,
    };
  }
  componentDidMount = () => {
    this.setState({
      width: this.myInput.parentNode.clientWidth,
    });
  }
  toggleEllipsis = () => {
    this.setState(({ more }) => {
      return {
        more: !more,
      };
    });
  }
  render() {
    return (
      <div
        ref={ (input) => { this.myInput = input; } }
        style={ {
          width: '100%',
        } }
      >
        <Ellipsis
          more={ this.state.more }
          text={ this.props.text }
          toggleEllipsis={ this.toggleEllipsis }
          width={ this.state.width }
        />
      </div>
    );
  }
}

EllipsisContainer.defaultProps = {
  text: '',
};

EllipsisContainer.propTypes = {
  text: PropTypes.string,
};

export default EllipsisContainer;
