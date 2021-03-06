import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import EnsureLogin from './ensure-login';

class EnsureLoggedInContainer extends React.Component {
  render() {
    if (this.props.signedIn) {
      return this.props.children;
    }
    return <EnsureLogin />;
  }
}

EnsureLoggedInContainer.propTypes = {
  children: PropTypes.node.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.user.signedIn,
  };
};

const Container = connect(
  mapStateToProps,
)(EnsureLoggedInContainer);

export default Container;
