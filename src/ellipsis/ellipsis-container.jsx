import PropTypes from 'prop-types';
import React from 'react';

import Ellipsis from './ellipsis';

let canvas;
const defaults = {
  fontFamily: 'sans-serif',
  fontSize: '12px',
};

class EllipsisContainer extends React.Component {
  constructor(props) {
    super(props);
    canvas = document.createElement('canvas');
    this.state = {
      more: false,
      resize: '',
      showButton: true,
    };
  }
  componentDidMount = () => {
    this.configEllipsis();
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  configEllipsis = () => {
    const parentWidth = this.ellipsisContainer.parentNode.clientWidth;
    const fontFamily = window.getComputedStyle(this.ellipsisContainer.parentNode).fontFamily;
    const fontSize = window.getComputedStyle(this.ellipsisContainer.parentNode).fontSize;
    this.setState({
      resize: '',
      showButton: this.doesTextOverflow(
        this.props.text,
        {
          fontFamily,
          fontSize,
        },
        parentWidth
      ),
      text: this.props.text,
      width: parentWidth,
    });
  }
  doesTextOverflow = (text, style, parentWidth) => {
    return this.measureText(text, style) > parentWidth;
  }
  measureText = (text, style) => {
    const context = canvas.getContext('2d');
    const font = style.fontFamily ? style.fontFamily : defaults.fontFamily;
    const fontSize = style.fontSize ? style.fontSize : style.fontSize;
    context.font = `${fontSize} ${font}`;
    return context.measureText(text).width;
  }
  resize = () => {
    this.setState(({ resize }) => {
      window.clearTimeout(resize);
      return {
        resize: setTimeout(this.configEllipsis, 500),
        text: '',
      };
    });
  }
  toggleEllipsis = () => {
    this.setState(({ more }) => {
      return {
        more: !more,
      };
    });
  }
  render() {
    return (
      <div
        ref={ (input) => { this.ellipsisContainer = input; } }
      >
        <Ellipsis
          more={ this.state.more }
          showButton={ this.state.showButton }
          text={ this.state.text }
          toggleEllipsis={ this.toggleEllipsis }
          width={ this.state.width }
        />
      </div>
    );
  }
}

EllipsisContainer.defaultProps = {
  text: '',
};

EllipsisContainer.propTypes = {
  text: PropTypes.string,
};

export default EllipsisContainer;
