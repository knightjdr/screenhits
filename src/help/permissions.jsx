import React from 'react';

import HelpStyle from './help-style';

class Permissions extends React.Component {
  render() {
    return (
      <div>
        <p>
          There are three types of users in ScreenHits. When you are given access
          you will be assigned to one of these roles.
        </p>
        <ol>
          <li
            style={ HelpStyle.list }
          >
            Standard users have permission to create content, edit content
            they have created and view content from their lab (by default).
          </li>
          <li
            style={ HelpStyle.list }
          >
            Lab administrators have the same ability to create and edit their own
            content but also have full write permissions across their lab. This means
            they can edit and delete any content created by their fellow lab members.
            Lab administrators can also create protocol templates and default protocols
            for other lab members to use.
          </li>
          <li
            style={ HelpStyle.list }
          >
            Site administrators have full permission to create, view, edit and delete
            content regardless of which user or lab the content belongs.
          </li>
        </ol>
      </div>
    );
  }
}

export default Permissions;
