const userProjects = {
  // filter projects to remove user if blocked, and deletes unwanted fields
  filterProjects: (email, projects, returnFields) => {
    const filteredProjects = projects;
    // remove project if user does not have permission
    filteredProjects.forEach((project, index) => {
      const userExclude = project.userPermission.findIndex((user) => {
        return (
          user.email === email &&
          user.permission === 'n'
        );
      });
      if (userExclude > -1) {
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
    const queryObj = {
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
    const returnObj = {};
    return { queryObj, returnObj };
  },
};
module.exports = userProjects;
