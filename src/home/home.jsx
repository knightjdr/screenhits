import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

import LogoImg from '../assets/logo/main-logo-for-web.png';
import Signin from '../signin/signin-container';

class Home extends React.Component {
  render() {
    return (
      <div
        style={ {
          height: 'calc(100vh - 65px)',
          position: 'relative',
        } }
      >
        <svg
          style={ {
            height: 'inherit',
            position: 'absolute',
            width: '100%',
            zIndex: -1,
          } }
        >
          {
            this.props.backdrop.map((dot) => {
              return (
                <circle
                  cx={ dot.x }
                  cy={ dot.y }
                  fill={ dot.fill }
                  key={ dot.key }
                  opacity="0.4"
                  r={ dot.radius }
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.4"
                    dur="1000ms"
                  />
                </circle>
              );
            })
          }
        </svg>
        <div
          style={ {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 65px)',
            justifyContent: 'center',
            width: '100%',
          } }
        >
          <img
            alt="ScreenHits logo"
            src={ LogoImg }
          />
          <div
            style={ {
              marginTop: 30,
            } }
          >
            <Signin />
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  backdrop: PropTypes.arrayOf(
    PropTypes.shape({
      fill: PropTypes.string,
      key: PropTypes.string,
      radius: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    })
  ).isRequired,
};

export default Radium(Home);
