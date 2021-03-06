import React from 'react';

export default class NoMatch extends React.Component {
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
        <div
          style={ {
            alignItems: 'flex-start',
            display: 'flex',
            maxWidth: 600,
          } }
        >
          <div
            style={ {
              marginRight: 10,
            } }
          >
            404:
          </div>
          <div>
            Either this page does not exist, or you do not have permission to access it.
            If you believe it should exist, return to the home page and ensure you are
            signed in, then try loading the page again.
          </div>
        </div>
      </div>
    );
  }
}
