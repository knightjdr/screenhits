import PropTypes from 'prop-types';
import React from 'react';

import AnalysisMenu from './analysis-menu';

class AnalysisMenuContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      radius: 30,
      showList: false,
    };
  }
  changeView = (newView) => {
    this.props.changeView(newView);
    this.hideAnalysisList();
  }
  enlargeMenu = () => {
    this.setState({
      radius: 50,
    });
  }
  hideAnalysisList = () => {
    this.setState({
      showList: false,
    });
  }
  showAnalysisList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  shrinkMenu = () => {
    this.setState({
      radius: 30,
    });
  }
  render() {
    return (
      <AnalysisMenu
        changeView={ this.changeView }
        anchorEl={ this.state.anchorEl }
        enlargeMenu={ this.enlargeMenu }
        hideAnalysisList={ this.hideAnalysisList }
        radius={ this.state.radius }
        showList={ this.state.showList }
        showAnalysisList={ this.showAnalysisList }
        shrinkMenu={ this.shrinkMenu }
        view={ this.props.view }
      />
    );
  }
}

AnalysisMenuContent.defaultProps = {
  view: null,
};

AnalysisMenuContent.propTypes = {
  changeView: PropTypes.func.isRequired,
  view: PropTypes.string,
};

export default AnalysisMenuContent;
