import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../help-image-container';
import NavigationImg from './images/navigation.png';

class Navigation extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              Navigation
            </p>
            <HelpImage
              caption="Management home page"
              height={ 600 }
              image={ NavigationImg }
              legend="Legend text"
            />
          </div>
        }
      </div>
    );
  }
}

Navigation.defaultProps = {
  children: null,
};

Navigation.propTypes = {
  children: PropTypes.shape({}),
};

export default Navigation;
