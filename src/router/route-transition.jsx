import React from 'react';
import { Route } from 'react-router';
import { TransitionMotion, spring } from 'react-motion';

const styles = {
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

class RouteTransition extends React.Component {
  willLeave = () => {
    return {
      zIndex: 1,
      opacity: spring(0),
    };
  }
  render() {
    return (
      <Route
        children={ ({ matched, ...props }) => {
          return (
            <TransitionMotion
              willLeave={willLeave}
              styles={matched ? [ {
                key: props.location.pathname,
                style: { opacity: 1 },
                data: props
              } ] : []}
            >
              {interpolatedStyles => (
                <div>
                  {interpolatedStyles.map(config => (
                    <div
                      key={config.key}
                      style={{ ...styles.fill, ...config.style }}
                    >
                      <Component {...config.data} />
                    </div>
                  ))}
                </div>
                )}
            </TransitionMotion>
                )
      } } />
    )
  }
}

export default RouteTransition;
