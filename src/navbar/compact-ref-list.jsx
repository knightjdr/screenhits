import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const RadiumLink = Radium(Link);

class CompactRefList extends React.Component {
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
      <div
        style={ {
          position: 'relative',
          right: 5,
          top: 5,
        } }
      >
        <button
          onClick={ this.props.showMenu }
          style={ {
            background: 'none',
            border: 'none',
            color: this.props.muiTheme.palette.offWhite,
            cursor: 'pointer',
            fontSize: 30,
            margin: 0,
            padding: 0,
          } }
        >
          <FontAwesome name="list" />
        </button>
        { !this.props.viewMenu ? null :
        <button
          onClick={ this.props.closeBackdrop }
          style={ {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            border: 'none',
            height: '100%',
            left: 0,
            top: 0,
            position: 'fixed',
            width: '100%',
            zIndex: 10,
          } }
        >
          <div
            style={ Object.assign(
              {},
              menuPosition,
              {
                backgroundColor: this.props.muiTheme.palette.offWhite,
                borderRadius: 2,
                position: 'absolute',
                zIndex: 11,
              },
            ) }
          >
            <ul
              style={ {
                fontFamily: 'Lato',
                fontSize: 22,
                listStyle: 'none',
                margin: '0px 0px 0px 0px',
                padding: '0px 0px 0px 0px',
              } }
            >
              { this.props.items.map((item) => {
                return (
                  <RadiumLink
                    key={ item.link }
                    style={ {
                      textDecoration: 'none',
                    } }
                    to={ item.link }
                  >
                    <li
                      style={ {
                        color: this.props.muiTheme.palette.primary1Color,
                        ':hover': {
                          backgroundColor: this.props.muiTheme.palette.primary4Color,
                        },
                        padding: '5px 10px 5px 10px',
                      } }
                    >
                      { item.name }
                    </li>
                  </RadiumLink>
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
  closeBackdrop: PropTypes.func.isRequired,
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
      primary4Color: PropTypes.string,
    }),
  }).isRequired,
  showMenu: PropTypes.func.isRequired,
  viewMenu: PropTypes.bool.isRequired,
};

export default Radium(muiThemeable()(CompactRefList));
