import Helmet from 'react-helmet';
import React from 'react';

export default class Favicon extends React.Component {
  render() {
    return (
      <Helmet
        link={[
          {rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png"},
          {rel: "icon", sizes: "32x32", type: "image/png", href: "/favicon/favicon-32x32.png"},
          {rel: "icon", sizes: "16x16", type: "image/png", href: "/favicon/favicon-16x16.png"},
          {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"},
          {rel: "manifest", href: "/favicon/manifest.json"}
        ]}
        meta={[
          {name: "theme-color", content: "#ffffff"}
        ]}
      />
    )
  }
}
