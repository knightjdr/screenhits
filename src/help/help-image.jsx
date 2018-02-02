import LazyLoad from 'react-lazyload';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import React from 'react';

import HelpStyle from './help-style';

class HelpImage extends React.Component {
  closeLightbox = () => {}
  render() {
    return (
      <div
        style={ {
          textAlign: 'center',
        } }
      >
        <LazyLoad
          height={ this.props.height }
          offset={ 100 }
        >
          <button
            onClick={ this.props.open }
            style={ HelpStyle.noButton }
          >
            <img
              alt="HelpImage"
              src={ this.props.image }
              style={ {
                cursor: 'pointer',
                maxWidth: '100%',
              } }
            />
          </button>
        </LazyLoad>
        <Lightbox
          backdropClosesModal={ true }
          images={ [
            {
              caption: this.props.caption,
              src: this.props.image,
            },
          ] }
          isOpen={ this.props.isOpen }
          onClose={ this.props.close }
          showImageCount={ false }
        />
        <div
          style={ {
            padding: '0 30px',
            textAlign: 'left',
          } }
        >
          { this.props.legend }
        </div>
      </div>
    );
  }
}

HelpImage.defaultProps = {
  caption: '',
  legend: '',
};

HelpImage.propTypes = {
  caption: PropTypes.string,
  close: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  legend: PropTypes.string,
  open: PropTypes.func.isRequired,
};

export default HelpImage;
