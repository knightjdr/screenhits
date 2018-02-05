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
              There are two different ways of navigating the management section of
              ScreenHits. The first and default is the hierarchical view, which is
              where content creation, viewing and editing occurs. The second is a list
              view that is ideal for quickly searching and filtering items at specifed
              levels.
            </p>
            <p>
              Theses views can be switched by clicking the toggle view button.
            </p>
            <HelpImage
              caption="Navigation toggle"
              height={ 600 }
              image={ NavigationImg }
              legend="Click 1) to toggle between organizational views"
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
