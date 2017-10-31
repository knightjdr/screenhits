import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';

import Tooltip from './tooltip';

class TooltipContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipPosition: this.getTooltipPosition(
        this.props.position,
        this.props.rect,
        this.props.text,
        this.props.tooltipStyle
      ),
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (
      !deepEqual(nextProps.rect, this.props.rect) ||
      nextProps.position !== this.props.position
    ) {
      this.setState({
        tooltipPosition: this.getTooltipPosition(
          nextProps.position,
          nextProps.rect,
          nextProps.text,
          nextProps.tooltipStyle
        ),
      });
    }
  }
  getTooltipPosition = (position, rect, text, style) => {
    const containerPadding = style.padding ? style.padding * 2 : 10;
    const lineHeight = style.lineHeight ? style.lineHeight : 12;
    const linePadding = typeof text === 'string' ? 4 : text.length * 4;
    const textHeight = typeof text === 'string' ?
      lineHeight
      :
      lineHeight * text.length
    ;
    const bodyHeight = containerPadding + linePadding + textHeight;
    switch (position) {
      case 'right':
        return {
          top: (rect.top + (rect.height / 2)) - ((bodyHeight / 2) + this.props.offsetTop),
          left: rect.right + 5,
        }
      ;
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
        }
      ;
      case 'left':
        return {
          right: '105%',
          top: (rect.top + (rect.height / 2)) - ((bodyHeight / 2) + this.props.offsetTop),
        }
      ;
      default:
        return {
          left: rect.left,
          top: (rect.top) - (5 + bodyHeight + this.props.offsetTop),
        }
      ;
    }
  }
  render() {
    return (
      <Tooltip
        position={ this.props.position }
        show={ this.props.show }
        text={ this.props.text }
        tooltipPosition={ this.state.tooltipPosition }
        tooltipStyle={ this.props.tooltipStyle }
      />
    );
  }
}

TooltipContainer.defaultProps = {
  offsetTop: 0,
  tooltipStyle: {},
};

TooltipContainer.propTypes = {
  offsetTop: PropTypes.number,
  position: PropTypes.string.isRequired,
  rect: PropTypes.shape({
    bottom: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.string,
    ),
    PropTypes.string,
  ]).isRequired,
  tooltipStyle: PropTypes.shape({}),
};

export default TooltipContainer;
