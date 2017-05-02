import Helmet from 'react-helmet';
import React from 'react';

import Favicon from './favicon';

export default class Head extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="ScreenHits" />
        <Favicon />
      </div>
    );
  }
}
