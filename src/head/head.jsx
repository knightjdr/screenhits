import Favicon from 'root/head/favicon.jsx';
import Helmet from 'react-helmet';
import React from 'react';

export default class Head extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="ScreenHits" />
        <Favicon />
      </div>
    )
  }
}
