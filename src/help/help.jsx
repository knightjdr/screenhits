import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import HelpRoutes from './help-routes';

const linkStyle = {
  textDecoration: 'none',
};

class Help extends React.Component {
  children = (parentRoute, children) => {
    return (
      children &&
      children.length > 0 ?
        <div
          key={ `${parentRoute}-child-container` }
          style={ {
            marginLeft: 10,
            padding: '2px 0',
          } }
        >
          {
            children.map((child) => {
              const path = `${parentRoute}/${child.name}`;
              return (
                <div
                  key={ path }
                  style={ {
                    padding: '2px 0',
                  } }
                >
                  { this.makeLink(`link-${path}`, path, child.text) }
                  { this.children(child.name, child.children) }
                </div>
              );
            })
          }
        </div>
        :
        null
    );
  }
  majorHelp = (majorRoute) => {
    const path = `/help/${majorRoute.name}`;
    return (
      <div
        key={ path }
        style={ {
          margin: '10px 0',
        } }
      >
        { this.makeLink(`link-${path}`, `/help/${majorRoute.name}`, majorRoute.text) }
        { this.children(path, majorRoute.children) }
      </div>
    );
  }
  makeLink = (key, to, text) => {
    return (
      <Link
        key={ key }
        style={ Object.assign(
          {},
          linkStyle,
          {
            color: this.props.muiTheme.palette.textColor,
          }
        ) }
        to={ to }
      >
        { text }
      </Link>
    );
  }
  render() {
    return (
      <div
        style={ {
          display: 'flex',
        } }
      >
        <div
          style={ {
            backgroundColor: this.props.muiTheme.palette.primary4Color,
            boxShadow: '1px 0px 5px 0px rgba(0,0,0,0.75)',
            height: 'calc(100vh - 60px)',
            maxWidth: 150,
            minWidth: 100,
            overflowY: 'auto',
            padding: '0px 10px',
            width: 'auto',
          } }
        >
          { HelpRoutes.map((majorRoute) => { return this.majorHelp(majorRoute); }) }
        </div>
        <div
          style={ {
            color: this.props.muiTheme.palette.textColor,
            flexGrow: 1,
            padding: '10px 0px 10px 10px',
          } }
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}

Help.defaultProps = {
  children: null,
};

Help.propTypes = {
  children: PropTypes.shape({}),
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary4Color: PropTypes.string,
      textColor: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(Help);
