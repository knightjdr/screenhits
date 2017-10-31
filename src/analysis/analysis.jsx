import React from 'react';

import NewAnalysis from './new-analysis/new-analysis-container';

class Analysis extends React.Component {
  render() {
    return (
      <div
        style={ {
          padding: '0px 10px 5px 10px',
        } }
      >
        <NewAnalysis />
      </div>
    );
  }
}
export default Analysis;
