import React from 'react';

class EnsureLoggedIn extends React.Component {
  render() {
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          height: 'calc(100% - 70px)',
          justifyContent: 'center',
          padding: 20,
        } }
      >
        Please login to continue
      </div>
    );
  }
}

export default EnsureLoggedIn;
