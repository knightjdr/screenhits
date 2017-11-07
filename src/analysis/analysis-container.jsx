import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';

import Analysis from './analysis';

const possibleRoutes = [
  'archive',
  'new',
  'visualization',
];

class AnalysisContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedView: 'new',
      textWidth: this.getTextWidth(),
      view: this.checkView(this.props.params.view),
    };
  }
  componentWillMount = () => {
    // if view is invalid, remove from URL
    const view = this.checkView(this.props.params.view);
    if (
      this.props.params.view &&
      !view
    ) {
      browserHistory.replace('/analysis');
    }
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState(({ view }) => {
      if (nextProps.params.view !== view) {
        return { view: this.checkView(nextProps.params.view) };
      }
      return {};
    });
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getTextWidth = () => {
    return window.innerWidth > 680 ? 400 : window.innerWidth - 30;
  }
  changeView = (newView) => {
    if (newView !== this.state.view) {
      browserHistory.push(`/analysis/${newView}`);
    }
  }
  checkView = (desiredView) => {
    return possibleRoutes.includes(desiredView) ? desiredView : null;
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
