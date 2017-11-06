import PropTypes from 'prop-types';
import React from 'react';

import Analysis from './analysis';

class AnalysisContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedView: 'new',
      textWidth: this.getTextWidth(),
      view: this.props.params.view,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getTextWidth = () => {
    return window.innerWidth > 680 ? 400 : window.innerWidth - 30;
  }
  changeView = (newView) => {
    this.setState({
      view: newView,
    });
  }
  highlightView = (newView) => {
    this.setState({
      highlightedView: newView,
    });
  }
  resize = () => {
    this.setState({
      textWidth: this.getTextWidth(),
    });
  }
  render() {
    return (
      <Analysis
        changeView={ this.changeView }
        highlightView={ this.highlightView }
        highlightedView={ this.state.highlightedView }
        textWidth={ this.state.textWidth }
        view={ this.state.view }
      />
    );
  }
}

AnalysisContainer.propTypes = {
  params: PropTypes.shape({
    view: PropTypes.string,
  }).isRequired,
};

export default AnalysisContainer;
