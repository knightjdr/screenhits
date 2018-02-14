import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import CompactRefList from './compact-ref-list-container';
import HorizontalRefList from './horizontal-ref-list';

import LogoImg from '../assets/logo/logo-white.svg';

class Navbar extends React.Component {
  componentDidMount = () => {
    window.addEventListener('resize', this.props.resize);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.props.resize);
  }
  render() {
    return (
      <div
        style={ {
          backgroundColor: this.props.muiTheme.palette.primary1Color,
          borderBottom: `2px solid ${this.props.muiTheme.palette.primary2Color}`,
          color: this.props.muiTheme.palette.offWhite,
          height: 60,
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 5,
        } }
      >
        <Link to="/">
          <img
            alt="ScreenHits logo"
            src={ LogoImg }
            style={ {
              marginLeft: '2%',
              marginTop: 4,
            } }
          />
        </Link>
        <span
          style={ {
            float: 'right',
            lineHeight: '60px',
            marginright: '2%',
            textAlign: 'center',
          } }
        >
          { this.props.list === 'horizontal' ?
            <HorizontalRefList
              items={ this.props.links }
            /> :
            <CompactRefList
              anchor="topRight"
              items={ this.props.links }
            />
          }
        </span>
      </div>
    );
  }
}

Navbar.defaultProps = {
  links: [],
};

Navbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  list: PropTypes.string.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
      primary2Color: PropTypes.string,
    }),
  }).isRequired,
  resize: PropTypes.func.isRequired,
};

export default muiThemeable()(Navbar);
