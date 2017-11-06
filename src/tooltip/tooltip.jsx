import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const defaultModalStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  display: 'none',
  left: 0,
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  zIndex: 1000,
  ':focus': {
    outline: 0,
  },
};

const tooltipBasicStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderRadius: 4,
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: 12,
  lineHeight: '12px',
  padding: 5,
  position: 'relative',
  textAlign: 'center',
};

const tooltipContainer = {
  position: 'absolute',
  zIndex: 1001,
};

const tooltipArrowBottom = {
  borderColor: 'transparent transparent rgba(0, 0, 0, 0.8) transparent',
  borderStyle: 'solid',
  borderWidth: 5,
  bottom: '100%',
  left: '50%',
  marginLeft: -5,
  position: 'absolute',
};
const tooltipArrowLeft = {
  borderColor: 'transparent transparent transparent rgba(0, 0, 0, 0.8)',
  borderStyle: 'solid',
  borderWidth: 5,
  left: '100%',
  marginTop: -5,
  position: 'absolute',
  top: '50%',
};
const tooltipArrowRight = {
  borderColor: 'transparent rgba(0, 0, 0, 0.8) transparent transparent',
  borderStyle: 'solid',
  borderWidth: 5,
  marginTop: -5,
  position: 'absolute',
  right: '100%',
  top: '50%',
};
const tooltipArrowTop = {
  borderColor: 'rgba(0, 0, 0, 0.8) transparent transparent transparent',
  borderStyle: 'solid',
  borderWidth: 5,
  left: '50%',
  marginLeft: -5,
  position: 'absolute',
  top: '100%',
};

class Tooltip extends React.Component {
  getArrowStyle = (position) => {
    switch (position) {
      case 'right':
        return tooltipArrowRight;
      case 'bottom':
        return tooltipArrowBottom;
      case 'left':
        return tooltipArrowLeft;
      default :
        return tooltipArrowTop;
    }
  }
  render() {
    return (
      <button
        onClick={ this.props.hideTooltip }
        style={ Object.assign(
          {},
          defaultModalStyle,
          this.props.modalStyle,
          {
            display: this.props.show ? 'block' : 'none',
            height: window.innerHeight,
            width: window.innerWidth,
          }
        ) }
      >
        <span
          style={ Object.assign(
            {},
            tooltipContainer,
            this.props.tooltipContainerStyle,
            this.props.tooltipPosition,
          ) }
        >
          <div
            style={ Object.assign(
              {},
              tooltipBasicStyle,
              this.props.tooltipStyle,
            ) }
          >
            {
              typeof this.props.text === 'string' ?
                this.props.text
              :
              this.props.text.map((textString, index) => {
                const key = index;
                return (
                  <div
                    key={ `tooltipRow-${key}` }
                    style={ {
                      padding: '2px 0px',
                    } }
                  >
                    { textString }
                  </div>
                );
              })
            }
          </div>
          <span
            style={ this.getArrowStyle(this.props.position) }
          />
        </span>
      </button>
    );
  }
}

Tooltip.propTypes = {
  hideTooltip: PropTypes.func.isRequired,
  modalStyle: PropTypes.shape({}).isRequired,
  position: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.string,
    ),
    PropTypes.string,
  ]).isRequired,
  tooltipContainerStyle: PropTypes.shape({}).isRequired,
  tooltipPosition: PropTypes.shape({}).isRequired,
  tooltipStyle: PropTypes.shape({}).isRequired,
};

export default Radium(Tooltip);
