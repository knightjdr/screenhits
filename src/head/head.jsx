import Helmet from 'react-helmet';
import React from 'react';

export default class Head extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          title="ScreenHits"
          link={ [
            { type: 'text/plain', rel: 'author', href: `${process.env.ROOT}/humans.txt` },
            { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon/favicon-32x32.png' },
            { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon/favicon-16x16.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
            { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
            { rel: 'manifest', href: '/favicon/manifest.json' },
            { href: 'https://fonts.googleapis.com/css?family=Lato:900', rel: 'stylesheet', type: 'text/css' },
            { href: 'https://fonts.googleapis.com/css?family=Roboto', rel: 'stylesheet', type: 'text/css' },
          ] }
          meta={ [
            { name: 'robots', content: 'nofollow' },
            { name: 'theme-color', content: '#ffffff' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
            { name: 'msapplication-config', content: 'browserconfig.xml' },
          ] }
        />
      </div>
    );
  }
}
