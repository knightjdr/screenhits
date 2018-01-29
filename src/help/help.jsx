import React from 'react';

import UnderConstruction from '../under-construction/under-construction';

export default class Help extends React.Component {
  render() {
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        } }
      >
        <UnderConstruction />
      </div>
    );
  }
}
