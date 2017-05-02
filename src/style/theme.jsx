import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PropTypes from 'prop-types';
import React from 'react';

import {
  blueGrey300,
  blueGrey500,
  blueGrey800,
  orange400,
  orange600,
  orange900,
} from 'material-ui/styles/colors';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: orange600,
    accent2Color: orange900,
    accent3Color: orange400,
    alternateTextColor: blueGrey800,
    primary1Color: blueGrey500,
    primary2Color: blueGrey800,
    primary3Color: blueGrey300,
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
