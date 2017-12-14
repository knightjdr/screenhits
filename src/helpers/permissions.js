const Permissions = {
  canEdit: (user, project) => {
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
    } else if (
      Permissions.hasWritePermission(user.email, project.userPermission)
    ) {
      return true;
    }
    return false;
  },
  canManage: (user, project) => {
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
    const userIndex = specialUsers.findIndex((user) => {
      return user.email === email;
    });
    if (
      userIndex > -1 &&
      specialUsers[userIndex].permission === 'w'
    ) {
      return true;
    }
    return false;
  },
};
export default Permissions;
