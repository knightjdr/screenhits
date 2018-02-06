import PropTypes from 'prop-types';
import React from 'react';

class CreateSample extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              Typically samples to upload to ScreenHits will be in a tab-delimited
              format, although they can be images and in the future we will add support
              for other types (for example raw sequencing files). Currently users can
              upload sequencing files in text format and microscopy images in BMP, PNG,
              JPG or TIF format.
            </p>
            <p>
              As discussed in the preceeding section, users should enter either a
              drug concentration or timepoint for each sample they upload depending
              on the experiment design although for certain experimental designs
              these fields may not be requried at the sample level (and hence are
              optional). Both the sample name and replicate are mandatory fields.
            </p>
          </div>
        }
      </div>
    );
  }
}

CreateSample.defaultProps = {
  children: null,
};

CreateSample.propTypes = {
  children: PropTypes.shape({}),
};

export default CreateSample;
