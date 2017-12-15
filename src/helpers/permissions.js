const Permissions = {
  canEditProject: (user, project) => {
    if (user.privilege === 'siteAdmin') {
      return true;
    } else if (
      user.privilege === 'labAdmin' &&
      user.lab === project.lab
    ) {
      return true;
    } else if (
      project &&
      user.email === project.ownerEmail
    ) {
      return true;
    } else if (
      Permissions.hasWritePermission(user.email, project.userPermission)
    ) {
      return true;
    }
    return false;
  },
  canEditTask: (user, tasks) => {
    const taskArr = [];
    tasks.forEach((task) => {
      if (user.privilege === 'siteAdmin') {
        taskArr[task._id] = true;
      } else if (
        user.privilege === 'labAdmin' &&
        user.lab === task.lab
      ) {
        taskArr[task._id] = true;
      } else if (
        user.email === task.userEmail
      ) {
        taskArr[task._id] = true;
      } else {
        taskArr[task._id] = false;
      }
    });
    return taskArr;
  },
  canManageProject: (user, project) => {
    if (user.privilege === 'siteAdmin') {
      return true;
    } else if (
      user.privilege === 'labAdmin' &&
      user.lab === project.lab
    ) {
      return true;
    } else if (
      user.email === project.ownerEmail
    ) {
      return true;
    }
    return false;
  },
  hasWritePermission: (email, specialUsers) => {
    if (specialUsers) {
      const userIndex = specialUsers.findIndex((user) => {
        return user.email === email;
      });
      if (
        userIndex > -1 &&
        specialUsers[userIndex].permission === 'w'
      ) {
        return true;
      }
    }
    return false;
  },
};
export default Permissions;
