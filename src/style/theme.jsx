import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PropTypes from 'prop-types';
import React from 'react';

import {
  blueGrey100,
  blueGrey200,
  blueGrey300,
  blueGrey500,
  blueGrey600,
  blueGrey700,
  blueGrey800,
  blueGrey900,
  green500,
  green700,
  grey100,
  grey300,
  orange200,
  orange400,
  orange500,
  orange600,
  orange900,
  red400,
  red700,
  yellow700,
  yellow900,
} from 'material-ui/styles/colors';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: orange400,
    accent2Color: orange900,
    accent3Color: orange600,
    accent4Color: orange200,
    alert: yellow700,
    alertHover: yellow900,
    alternativeButtonColor: orange400,
    alternativeButtonColorHover: orange500,
    alternateTextColor: orange400,
    buttonColor: blueGrey600,
    buttonColorHover: blueGrey700,
    darkButtonColor: blueGrey800,
    darkButtonColorHover: blueGrey900,
    keyColor: blueGrey100,
    keyColorBorder: blueGrey200,
    offWhite: grey100,
    primary1Color: blueGrey500,
    primary2Color: blueGrey800,
    primary3Color: blueGrey300,
    primary4Color: blueGrey200,
    shading1: grey300,
    success: green500,
    successHover: green700,
    textColor: blueGrey900,
    warning: red400,
    warningHover: red700,
  },
});

export default class Theme extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={ muiTheme }>
        { this.props.children }
      </MuiThemeProvider>
    );
  }
}

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};
