import Helmet from 'react-helmet';
import React from 'react';

import Basic from './basic';
import Fonts from './fonts';
import Favicon from './favicon';

export default class Head extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          description="LIMS from managing screens"
          title="ScreenHits"
        />
        <Basic />
        <Favicon />
        <Fonts />
      </div>
    );
  }
}
