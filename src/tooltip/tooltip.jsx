import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const tooltipBasicStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderRadius: 4,
  color: '#fff',
  display: 'none',
  fontSize: 12,
  lineHeight: '12px',
  padding: 5,
  position: 'relative',
  textAlign: 'center',
};

const tooltipContainer = {
  position: 'absolute',
  zIndex: 1000,
};

const tooltipArrowBottom = {
  borderColor: 'transparent transparent gba(0, 0, 0, 0.8) transparent',
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
      <span
        style={ Object.assign(
          {},
          tooltipContainer,
          this.props.tooltipPosition,
        ) }
      >
        <span
          style={ Object.assign(
            {},
            tooltipBasicStyle,
            this.props.tooltipStyle,
            {
              display: this.props.show ? 'block' : 'none',
            }
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
        </span>
        <span
          style={ this.getArrowStyle(this.props.position) }
        />
      </span>
    );
  }
}

Tooltip.propTypes = {
  position: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.string,
    ),
    PropTypes.string,
  ]).isRequired,
  tooltipPosition: PropTypes.shape({}).isRequired,
  tooltipStyle: PropTypes.shape({}).isRequired,
};

export default Radium(Tooltip);
