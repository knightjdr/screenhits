const Permission = {
  set: (broadPermission, lab, users, exceptions, owner) => {
    const usersAdded = [];
    const userWithPermission = [];
    users.forEach((user) => {
      const currUser = user;
      const excepetionsIndex = exceptions.findIndex((obj) => { return obj.email === user.email; });
      if (user.email === owner) {
        currUser.permission = 'o';
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      } else if (excepetionsIndex > -1) {
        currUser.permission = exceptions[excepetionsIndex].permission;
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      } else if (broadPermission === 'aw') {
        currUser.permission = 'w';
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      } else if (broadPermission === 'ar') {
        currUser.permission = 'r';
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      } else if (broadPermission === 'lw' && user.lab === lab) {
        currUser.permission = 'w';
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      } else if (broadPermission === 'lr' && user.lab === lab) {
        currUser.permission = 'r';
        userWithPermission.push(currUser);
        usersAdded.push(currUser.email);
      }
    });
    exceptions.forEach((user) => {
      if (usersAdded.indexOf(user.email) < 0) {
        userWithPermission.push(user);
      }
    });
    return userWithPermission;
  },
};
module.exports = Permission;
