import React from 'react';

import HelpLink from '../../help-link';

class CreateProject extends React.Component {
  render() {
    return (
      <div>
        <p>
          Projects can be created by any user. Users can create multiple projects
          for themselves but typically each user would have one project containing
          all of their content. The person creating the project will become the
          project owner, giving him/her full write permission to the project
          and giving his/her lab read permission. These permissions can be adjusted
          as discussed in the section&nbsp;
          <HelpLink
            text="&apos;Managing Users&apos;"
            to="/help/management/users"
          />. Lab administrators will always have write permission to all projects
          created by their lab.
        </p>
      </div>
    );
  }
}

export default CreateProject;
