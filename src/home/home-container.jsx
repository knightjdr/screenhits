import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Rainbow from 'rainbowvis.js';
import React from 'react';

import Home from './home';
import Random from '../helpers/random-number';

const dotDiameter = 30;
const numberOfColors = 100;
const proportionToChange = 0.1;

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    const rainbow = new Rainbow();
    rainbow.setNumberRange(0, numberOfColors);
    rainbow.setSpectrum(
      this.props.muiTheme.palette.accent1Color,
      this.props.muiTheme.palette.offWhite,
      this.props.muiTheme.palette.primary1Color,
    );
    const windowSettings = this.windowSettings();
    this.state = {
      backdrop: this.createBackdrop(rainbow, windowSettings),
      colorRange: rainbow,
      windowSettings,
    };
  }
  componentDidMount = () => {
    setInterval(this.backdropInterval, 1000);
  }
  backdropInterval = () => {
    this.setState((prevState) => {
      return {
        backdrop: prevState.backdrop.map((dot) => {
          if (Math.random() < proportionToChange) {
            const { x, y } = this.coordinates(prevState.backdrop, prevState.windowSettings);
            return {
              fill: `#${prevState.colorRange.colorAt(Random.int(0, 100))}`,
              key: dot.key,
              radius: Random.int(0, prevState.windowSettings.radius),
              x,
              y,
            };
          }
          return dot;
        }),
      };
    });
  }
  coordinates = (pointsArr, windowSettings) => {
    const pointExists = (arr, x, y) => {
      return arr.findIndex((point) => {
        return point.x === x && point.y === y;
      });
    };
    let newX = windowSettings.possibleX[Random.int(0, windowSettings.possibleX.length - 1)];
    let newY = windowSettings.possibleY[Random.int(0, windowSettings.possibleY.length - 1)];
    do {
      newX = windowSettings.possibleX[Random.int(0, windowSettings.possibleX.length - 1)];
      newY = windowSettings.possibleY[Random.int(0, windowSettings.possibleY.length - 1)];
    } while (pointExists(pointsArr, newX, newY) > -1);
    return { x: newX, y: newY };
  };
  createBackdrop = (colorRange, windowSettings) => {
    const backdrop = [];
    let i = 0;
    const selectedPoints = [];
    do {
      const { x, y } = this.coordinates(selectedPoints, windowSettings);
      selectedPoints.push({ x, y });
      const dot = {
        fill: `#${colorRange.colorAt(Random.int(0, 100))}`,
        key: `dot${i}`,
        radius: Random.int(0, windowSettings.radius),
        x,
        y,
      };
      backdrop.push(dot);
      i += 1;
    } while (i < windowSettings.dotNumber);
    return backdrop;
  }
  windowSettings = () => {
    const radiusWithPadding = (dotDiameter / 2) + 6;
    const diameterWithPadding = radiusWithPadding * 2;
    const windowHeight = window.innerHeight - 65;
    const windowWidth = window.innerWidth;
    const xGridLength = Math.floor((windowWidth - radiusWithPadding) / diameterWithPadding);
    const yGridLength = Math.floor((windowHeight - radiusWithPadding) / diameterWithPadding);
    return {
      radius: (dotDiameter / 2),
      radiusWithPadding,
      diameterWithPadding,
      windowHeight,
      windowWidth,
      xGridLength,
      yGridLength,
      possibleX: [...Array(xGridLength).keys()].map(
        (point, index) => {
          return point + (diameterWithPadding * index) + radiusWithPadding;
        }),
      possibleY: [...Array(yGridLength).keys()].map(
        (point, index) => {
          return point + (diameterWithPadding * index) + radiusWithPadding;
        }),
      dotNumber: Math.floor((xGridLength * yGridLength) * 0.25),
    };
  }
  render() {
    return (
      <Home
        backdrop={ this.state.backdrop }
      />
    );
  }
}

HomeContainer.propTypes = {
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent1Color: PropTypes.string,
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(HomeContainer);
