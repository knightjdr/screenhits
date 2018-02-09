import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../help-image-container';
import AnalysisHomeImg from './images/analysis.png';

class Analysis extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              Currently in ScreenHits the analysis area is for CRISPR data alone.
              BAGEL, DrugZ, MAGeCK and RANKS algorithms are all supported. Begin analysis
              by selecting &apos;New analysis&apos;, view completed or queued
              analysis by selecting &apos;Archive&apos; and search for analysis
              results by gene by selecting &apos;Gene search&apos;.
            </p>
            <HelpImage
              caption="Analysis"
              height={ 330 }
              image={ AnalysisHomeImg }
              legend="Analysis main view"
            />
          </div>
        }
      </div>
    );
  }
}

Analysis.defaultProps = {
  children: null,
};

Analysis.propTypes = {
  children: PropTypes.shape({}),
};

export default Analysis;
