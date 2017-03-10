import 'root/assets/favicon/apple-icon-57x57.png';
import 'root/assets/favicon/apple-icon-60x60.png';
import 'root/assets/favicon/apple-icon-72x72.png';
import 'root/assets/favicon/apple-icon-76x76.png';
import 'root/assets/favicon/apple-icon-114x114.png';
import 'root/assets/favicon/apple-icon-120x120.png';
import 'root/assets/favicon/apple-icon-144x144.png';
import 'root/assets/favicon/apple-icon-152x152.png';
import 'root/assets/favicon/apple-icon-180x180.png';
import 'root/assets/favicon/android-icon-192x192.png';
import 'root/assets/favicon/favicon-32x32.png';
import 'root/assets/favicon/favicon-96x96.png';
import 'root/assets/favicon/favicon-16x16.png';
import 'root/assets/favicon/manifest.json';
import 'root/assets/favicon/ms-icon-144x144.png';
import Helmet from 'react-helmet';
import React from 'react';

export default class Favicon extends React.Component {
  render() {
    return (
      link={[
        {rel: "apple-touch-icon", sizes: "57x57", href: "images/apple-icon-57x57.png"}
      ]}
    )
  }
}

<link rel="apple-touch-icon" sizes="57x57" href="images/favicon/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="images/favicon/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="images/favicon/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="images/favicon/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="images/favicon/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="images/favicon/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="images/favicon/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="images/favicon/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="images/favicon/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="images/favicon/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
<link rel="manifest" href="images/favicon/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="images/favicon/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
