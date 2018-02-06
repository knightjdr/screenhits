import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../help-image-container';
import CreationImg from './images/creation.png';

class Creation extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              All content is added to ScreenHits via the hierarchical view. From
              any level the form for adding new items is accessed via the action
              menu at the bottom left hand corner.
            </p>
            <HelpImage
              caption="Creating items"
              height={ 600 }
              image={ CreationImg }
              legend="Open action menu and click to add new item"
            />
          </div>
        }
      </div>
    );
  }
}

Creation.defaultProps = {
  children: null,
};

Creation.propTypes = {
  children: PropTypes.shape({}),
};

export default Creation;
