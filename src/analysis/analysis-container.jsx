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
      viewID: this.checkID(this.props.params.view, this.props.params.id),
    };
  }
  componentWillMount = () => {
    // if view is valid, and if view can take an ID, else remove from URL
    const id = this.checkID(this.props.params.view, this.props.params.id);
    const view = this.checkView(this.props.params.view);
    if (
      this.props.params.view &&
      !view
    ) {
      browserHistory.replace('/analysis');
    } else if (
      this.props.params.id &&
      !id
    ) {
      browserHistory.replace(`/analysis/${view}`);
    }
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState(({ id, view }) => {
      if (nextProps.params.view !== view) {
        return {
          view: this.checkView(nextProps.params.view),
          viewID: this.checkID(nextProps.params.view, nextProps.params.id),
        };
      } else if (nextProps.params.id !== id) {
        return {
          viewID: this.checkID(view, nextProps.params.id),
        };
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
  checkID = (view, id) => {
    if (
      view === 'archive' &&
      id
    ) {
      return Number(id);
    }
    return null;
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
        viewID={ this.state.viewID }
      />
    );
  }
}

AnalysisContainer.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
    view: PropTypes.string,
  }).isRequired,
};

export default AnalysisContainer;
