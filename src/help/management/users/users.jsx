import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../help-image-container';
import Users1Img from './images/users-1.png';

class Users extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              By default each project will be visible to all members of the lab
              to which the project creator belongs. The creator is the
              project owner, having full write permissions to the project as well
              being able to control who else can view the project. If the owner wishes,
              he/she can give other lab members write permission or members of another
              lab read permission for example. The owner can even transfer ownership
              to another person. Lab administrators can also adjust permissions for
              all projects in their lab and site administrators can do this for all
              projects in ScreenHits. User management is accessed from at the project
              level from the action menu.
            </p>
            <HelpImage
              caption="Managing users"
              height={ 600 }
              image={ Users1Img }
              legend="Manage users by clicking the button in the action menu"
            />
          </div>
        }
      </div>
    );
  }
}

Users.defaultProps = {
  children: null,
};

Users.propTypes = {
  children: PropTypes.shape({}),
};


export default Users;
