import React from 'react';

import LogoImg from '../assets/logo/main-logo-for-web.png';

class Home extends React.Component {
  render() {
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          height: 'calc(100vh - 65px)',
          justifyContent: 'center',
          width: '100%',
        } }
      >
        <img
          alt="ScreenHits logo"
          src={ LogoImg }
        />
      </div>
    );
  }
}

export default Home;
