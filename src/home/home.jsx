import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { TransitionMotion, spring } from 'react-motion';

import LogoImg from '../assets/logo/main-logo-for-web.svg';
import Signin from '../signin/signin-container';

import './home.scss';

const springConfig = {
  stiffness: 125,
  damping: 67,
};

class Home extends React.Component {
  dotWillEnter = () => {
    return {
      opacity: 0,
    };
  }
  dotWillLeave = () => {
    return { opacity: spring(0, springConfig) };
  }
  footer = () => {
    return (
      <div
        style={ {
          bottom: 5,
          position: 'fixed',
        } }
      >
        &#169; 2018, the Gingras lab.
      </div>
    );
  }
  render() {
    return (
      <div
        style={ {
          height: 'calc(100vh - 65px)',
          position: 'relative',
        } }
      >
        <TransitionMotion
          willEnter={ this.dotWillEnter }
          willLeave={ this.dotWillLeave }
          styles={ this.props.backdrop.map((dot) => {
            return {
              data: {
                fill: dot.fill,
                radius: dot.radius,
                x: dot.x,
                y: dot.y,
              },
              key: `${dot.key}-dot`,
              style: {
                opacity: spring(0.4, springConfig),
              },
            };
          }) }
        >
          { (interpolatedStyles) => {
            return (
              <svg
                style={ {
                  height: 'inherit',
                  position: 'absolute',
                  width: '100%',
                  zIndex: -1,
                } }
              >
                { interpolatedStyles.map((dot) => {
                  return (
                    <circle
                      cx={ dot.data.x }
                      cy={ dot.data.y }
                      fill={ dot.data.fill }
                      key={ dot.key }
                      r={ dot.data.radius }
                      style={ dot.style }
                    />
                  );
                }) }
              </svg>
            );
          } }
        </TransitionMotion>
        <CSSTransitionGroup
          transitionAppear={ true }
          transitionAppearTimeout={ 1500 }
          transitionName="logo-transition"
          transitionEnter={ false }
          transitionLeave={ false }
        >
          <div
            key="logo-container"
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
              key="logo"
              src={ LogoImg }
            />
            <div
              key="signin"
              style={ {
                marginTop: 30,
              } }
            >
              <Signin
                key="signin"
              />
            </div>
          </div>
          <div
            style={ {
              bottom: 5,
              position: 'fixed',
              left: '50%',
              transform: 'translate(-50%, 0)',
            } }
          >
            &#169; 2018, the Gingras lab.
          </div>
        </CSSTransitionGroup>
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

export default Home;
