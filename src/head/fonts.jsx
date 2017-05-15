import Helmet from 'react-helmet';
import React from 'react';

export default class Fonts extends React.Component {
  render() {
    return (
      <Helmet
        link={ [
          { href: 'https://fonts.googleapis.com/css?family=Lato:900', rel: 'stylesheet', type: 'text/css' },
          { href: 'https://fonts.googleapis.com/css?family=Roboto', rel: 'stylesheet', type: 'text/css' },
        ] }
      />
    );
  }
}
