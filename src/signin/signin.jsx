import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

import GoogleIcon from './google.png';

const signinContainer = {
  cursor: 'pointer',
  display: 'flex',
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'white',
  ':focus': {
    outline: 0,
  },
  height: 36,
  width: 'auto',
  padding: '0px 0px 0px 0px',
  fontSize: 0,
};

const signinIcon = {
  backgroundImage: `url(${GoogleIcon})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '32px 32px',
  verticalAlign: 'top',
  width: 32,
  height: 32,
};

const signinText = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  fontSize: 18,
  height: 32,
  lineHeight: '32px',
  paddingLeft: 15,
  paddingRight: 15,
  textAlign: 'center',
};

const signinTextSpan = {
  width: 70,
};

class Signin extends React.Component {
  render() {
    return (
      <button
        onClick={ this.props.signin }
        style={
          Object.assign(
            {},
            signinContainer,
            { border: `2px solid ${this.props.muiTheme.palette.primary1Color}` }
          )
        }
      >
        <span
          style={ signinIcon }
        />
        <div
          style={
            Object.assign(
              {},
              signinText,
              {
                color: this.props.muiTheme.palette.offWhite,
                backgroundColor: this.props.muiTheme.palette.primary1Color,
              }
            )
          }
        >
          <span
            style={ signinTextSpan }
          >
            { this.props.signinText }
          </span>
        </div>
      </button>
    );
  }
}

Signin.propTypes = {
  signin: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
  signinText: PropTypes.string.isRequired,
};

export default muiThemeable()(Radium(Signin));
