import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router';

import HelpStyle from './help-style';

const Link = Radium(ReactRouterLink);

class HelpLink extends React.Component {
  render() {
    return (
      <Link
        activeStyle={ {
          color: this.props.muiTheme.palette.accent2Color,
        } }
        onlyActiveOnIndex={ true }
        style={ Object.assign(
          {},
          HelpStyle.link,
          {
            color: this.props.muiTheme.palette.textColor,
            ':hover': {
              color: this.props.muiTheme.palette.accent2Color,
            },
          }
        ) }
        to={ this.props.to }
      >
        { this.props.text }
      </Link>
    );
  }
}

HelpLink.propTypes = {
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent2Color: PropTypes.string,
      textColor: PropTypes.string,
    }),
  }).isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default muiThemeable()(Radium(HelpLink));
