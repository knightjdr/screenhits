import React from 'react';

import HelpImage from '../../help-image-container';
import Users2Img from './images/users-2.png';
import Users3Img from './images/users-3.png';

class UserCustomization extends React.Component {
  render() {
    return (
      <div>
        <p>
          All lab members will be given read permission to your projects. These
          permissions can be customized from the first tab on the user management
          screen. Click on the permission button next to any user to adjust
          his/her permissions.
        </p>
        <HelpImage
          caption="Changing user permissions"
          height={ 600 }
          image={ Users2Img }
          legend="Changing user permissions. 1) Change current user permissions
            tab, 2) add new users tab"
        />
        <p>
          New users can be added from the second tab of the user management screen.
          You can search for users by name or email, or search for a particular lab
          by name to get a list of all lab members. Once the desired user is found,
          set his/her permissions from the permission dropdown and add him/her to the
          project. Alternatively, the bulk permission for a project can be changed.
          For example, if you want to give everyone from your lab write permission
          or every ScreenHits user read permission, this can be done from the
          dropdown at the bottom of the page.
        </p>
        <HelpImage
          caption="Adding users"
          height={ 740 }
          image={ Users3Img }
          legend="Add users. 1) Enter the name or email of the person to add, 2)
          specify his/her permission and add to the project, 3) modify the bulk
          permissions for the project"
        />
      </div>
    );
  }
}

export default UserCustomization;
