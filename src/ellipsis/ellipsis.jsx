import PropTypes from 'prop-types';
import React from 'react';

class Ellipsis extends React.Component {
  render() {
    const ellipsisStyle = this.props.more ?
    {
      display: 'inline',
      maxWidth: this.props.width,
      overflow: 'visible',
      textOverflow: 'inherit',
      whiteSpace: 'inherit',
      width: this.props.width,
    }
    :
    {
      display: 'inline-block',
      maxWidth: this.props.width - 50,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: this.props.width - 50,
    };
    return (
      <div
        style={ {
          position: 'relative',
        } }
      >
        <div
          style={ ellipsisStyle }
        >
          { this.props.text }
        </div>
        <button
          onClick={ this.props.toggleEllipsis }
          style={ {
            border: 'none',
            borderBottom: '1px dotted blue',
            color: 'blue',
            cursor: 'pointer',
            display: 'inline',
            fontWeight: 'normal',
            marginLeft: 5,
            outline: 'none',
            position: this.props.more ? 'relative' : 'absolute',
            top: 0,
          } }
        >
          { this.props.more ? 'less' : 'more' }
        </button>
      </div>
    );
  }
}

Ellipsis.defaultProps = {
  text: '',
  width: 0,
};

Ellipsis.propTypes = {
  more: PropTypes.bool.isRequired,
  text: PropTypes.string,
  toggleEllipsis: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default Ellipsis;
