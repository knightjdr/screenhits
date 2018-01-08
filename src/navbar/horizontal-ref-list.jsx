import { Link } from 'react-router';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const RadiumLink = Radium(Link);

class HorizontalRefList extends React.Component {
  render() {
    return (
      <ul
        style={ {
          display: 'inline',
          listStyle: 'none',
        } }
      >
        { this.props.items.map((item) => {
          return (
            <li
              key={ item.link }
              style={ {
                backgroundColor: this.props.muiTheme.palette.primary1Color,
                cursor: 'pointer',
                display: 'inline',
                fontFamily: 'Lato',
                fontSize: 22,
                margin: '0px 4px 0px 4px',
              } }
            >
              <RadiumLink
                style={ {
                  borderRadius: 4,
                  color: this.props.muiTheme.palette.offWhite,
                  display: 'inline',
                  ':hover': {
                    backgroundColor: this.props.muiTheme.palette.offWhite,
                    color: this.props.muiTheme.palette.primary1Color,
                  },
                  padding: '0px 5px 0px 5px',
                  textDecoration: 'none',
                } }
                to={ item.link }
              >
                { item.name }
              </RadiumLink>
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
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
};

export default Radium(muiThemeable()(HorizontalRefList));
