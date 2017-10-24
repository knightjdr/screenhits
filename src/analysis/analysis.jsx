import React from 'react';

import NewAnalysis from './new-analysis/new-analysis-container';

class Analysis extends React.Component {
  render() {
    return (
      <div
        style={ {
          padding: '0px 5px 5px 5px',
        } }
      >
        <NewAnalysis />
      </div>
    );
  }
}
export default Analysis;
