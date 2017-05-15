import Helmet from 'react-helmet';
import React from 'react';

export default class Bsic extends React.Component {
  render() {
    return (
      <Helmet
        meta={ [
          { name: 'robots', content: 'nofollow' },
          { charSet: 'utf-8' },
        ] }
      />
    );
  }
}
