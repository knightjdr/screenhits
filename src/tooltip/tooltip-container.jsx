import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';

import Tooltip from './tooltip';

let canvas;
const defaults = {
  containerWidth: 200,
  family: 'sans-serif',
  size: '12px',
};

class TooltipContainer extends React.Component {
  constructor(props) {
    super(props);
    canvas = document.createElement('canvas');
    const textWidth = this.getTextWidth(
      this.props.text,
      this.props.tooltipStyle
    );
    const tooltipPosition = this.getTooltipPosition(
      this.props.position,
      this.props.rect,
      this.props.text,
      this.props.tooltipStyle,
      textWidth
    );
    this.state = {
      show: this.props.show,
      tooltipPosition,
      textWidth,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.hideTooltip);
    window.addEventListener('scroll', this.hideTooltip);
    window.addEventListener('wheel', this.hideTooltip);
  }
  componentWillReceiveProps = (nextProps) => {
    if (!deepEqual(nextProps, this.props)) {
      const textWidth = this.getTextWidth(
        nextProps.text,
        nextProps.tooltipStyle
      );
      const tooltipPosition = this.getTooltipPosition(
        nextProps.position,
        nextProps.rect,
        nextProps.text,
        nextProps.tooltipStyle,
        textWidth
      );
      this.setState({
        show: nextProps.show,
        tooltipPosition,
        textWidth,
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.hideTooltip);
    window.removeEventListener('scroll', this.hideTooltip);
    window.removeEventListener('wheel', this.hideTooltip);
  }
  getTextWidth = (text, tooltipStyle) => {
    const context = canvas.getContext('2d');
    const font = tooltipStyle.fontFamily ? tooltipStyle.fontFamily : defaults.family;
    const fontSize = tooltipStyle.fontSize ? tooltipStyle.fontSize : defaults.size;
    context.font = `${fontSize} ${font}`;
    let width = 0;
    if (typeof text === 'string') {
      width = context.measureText(text).width;
    } else {
      text.forEach((textString) => {
        const currWidth = context.measureText(textString).width;
        if (currWidth > width) {
          width = currWidth;
        }
      });
    }
    const padding = tooltipStyle.padding ? tooltipStyle.padding : 10;
    return Math.ceil(width) + padding;
  }
  getTooltipPosition = (position, rect, text, style, textWidth) => {
    const containerPadding = style.padding ? style.padding * 2 : 10;
    const lineHeight = style.lineHeight ? parseInt(style.lineHeight, 10) : 12;
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
          top: (rect.top + (rect.height / 2)) - ((bodyHeight / 2)),
          left: rect.right + 5,
        }
      ;
      case 'bottom':
        return {
          left: rect.left + ((rect.width - textWidth) / 2),
          top: rect.bottom + 5,
        }
      ;
      case 'left':
        return {
          left: rect.left - 5 - textWidth,
          top: (rect.top + (rect.height / 2)) - ((bodyHeight / 2)),
        }
      ;
      default:
        return {
          left: rect.left + ((rect.width - textWidth) / 2),
          top: (rect.top) - (5 + bodyHeight),
        }
      ;
    }
  }
  hideTooltip = () => {
    this.props.hideTooltip();
    this.setState(({ show }) => {
      return show ? { show: false } : {};
    });
  }
  render() {
    return (
      <Tooltip
        hideTooltip={ this.hideTooltip }
        modalStyle={ this.props.modalStyle }
        position={ this.props.position }
        show={ this.state.show }
        text={ this.props.text }
        tooltipContainerStyle={ this.props.tooltipContainerStyle }
        tooltipPosition={ this.state.tooltipPosition }
        tooltipStyle={ this.props.tooltipStyle }
      />
    );
  }
}

TooltipContainer.defaultProps = {
  hideTooltip: () => {},
  modalStyle: {},
  tooltipContainerStyle: {},
  tooltipStyle: {},
};

TooltipContainer.propTypes = {
  hideTooltip: PropTypes.func,
  modalStyle: PropTypes.shape({}),
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
  tooltipContainerStyle: PropTypes.shape({}),
  tooltipStyle: PropTypes.shape({}),
};

export default TooltipContainer;
