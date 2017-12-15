const userProjects = {
  // filter projects to remove user if blocked, and deletes unwanted fields
  filterProjects: (user, projects, returnFields) => {
    const filteredProjects = projects;
    // site admins cannot be blocked at all
    // lab admins cannot be blocked from their own labs project
    const canBlock = (currUser, item) => {
      if (currUser.privilege === 'siteAdmin') {
        return false;
      } else if (
        currUser.privilege === 'labAdmin' &&
        currUser.lab === item.lab
      ) {
        return false;
      }
      return true;
    };

    // remove project if user does not have permission
    filteredProjects.forEach((project, index) => {
      const userExclude = project.userPermission.findIndex((specialUser) => {
        return (
          specialUser.email === user.email &&
          specialUser.permission === 'n'
        );
      });
      if (
        userExclude > -1 &&
        canBlock(user, project.userPermission[userExclude])
      ) {
        filteredProjects.splice(index, 1);
      }
    });
    // format projects to only return desired fields
    return filteredProjects.map((project) => {
      const newProject = project;
      Object.keys(newProject).forEach((key) => {
        if (
          returnFields &&
          !returnFields.project.includes(key)
        ) {
          delete newProject[key];
        }
      });
      return newProject;
    });
  },
  // project query object
  query: (user) => {
    let queryObj = {};
    if (user.privilege === 'siteAdmin') {
      queryObj = {};
    } else if (user.privilege === 'labAdmin') {
      queryObj = {
        $or: [
          { creatorEmail: user.email }, // created the project
          { // project is in the same lab
            $and: [
              { lab: user.lab },
            ],
          },
          { // anyone can view this project
            $and: [
              { permission: { $in: ['ar', 'aw'] } },
            ],
          },
          { // user has been explicitly added
            userPermission: { $elemMatch: { email: user.email, permission: { $ne: 'n' } } },
          },
        ],
      };
    } else {
      queryObj = {
        $or: [
          { creatorEmail: user.email }, // created the project
          { // project is in the same lab
            $and: [
              { lab: user.lab },
              { permission: { $in: ['lr', 'lw'] } },
            ],
          },
          { // anyone can view this project
            $and: [
              { permission: { $in: ['ar', 'aw'] } },
            ],
          },
          { // user has been explicitly added
            userPermission: { $elemMatch: { email: user.email, permission: { $ne: 'n' } } },
          },
        ],
      };
    }
    const returnObj = {};
    return { queryObj, returnObj };
  },
};
module.exports = userProjects;
