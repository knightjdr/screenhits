import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from './help-image';

class HelpImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  close = () => {
    this.setState({
      isOpen: false,
    });
  }
  open = () => {
    this.setState({
      isOpen: true,
    });
  }
  render() {
    return (
      <HelpImage
        caption={ this.props.caption }
        close={ this.close }
        height={ this.props.height }
        image={ this.props.image }
        isOpen={ this.state.isOpen }
        legend={ this.props.legend }
        open={ this.open }
      />
    );
  }
}

HelpImageContainer.defaultProps = {
  caption: '',
  legend: '',
};

HelpImageContainer.propTypes = {
  caption: PropTypes.string,
  height: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  legend: PropTypes.string,
};

export default HelpImageContainer;
