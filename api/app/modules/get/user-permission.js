const Permission = {
  set: (broadPermission, lab, users, exceptions) => {
    const userWithPermission = [];
    users.forEach((user) => {
      const currUser = user;
      const excepetionsIndex = exceptions.findIndex((obj) => { return obj.email === user.email; });
      if (excepetionsIndex > -1) {
        currUser.permission = exceptions[excepetionsIndex].permission;
        userWithPermission.push(currUser);
      } else if (broadPermission === 'aw') {
        currUser.permission = 'w';
        userWithPermission.push(currUser);
      } else if (broadPermission === 'ar') {
        currUser.permission = 'r';
        userWithPermission.push(currUser);
      } else if (broadPermission === 'lw' && user.lab === lab) {
        currUser.permission = 'w';
        userWithPermission.push(currUser);
      } else if (broadPermission === 'lr' && user.lab === lab) {
        currUser.permission = 'r';
        userWithPermission.push(currUser);
      }
    });
    return userWithPermission;
  },
};
module.exports = Permission;
