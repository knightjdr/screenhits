const query = require('../query/query');

const Permission = {
  canEdit: {
    experiment: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('experiment', { _id }, { group: 1 }, 'findOne')
          .then((experiment) => {
            return query('project', { _id: experiment.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    project: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('project', { _id }, { lab: 1, ownerEmail: 1, userPermission: 1 }, 'findOne')
          .then((project) => {
            return Permission.checkProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    protocol: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('protocol', { _id }, { creatorEmail: 1 }, 'findOne')
          .then((protocol) => {
            return Permission.checkProtocol(protocol, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    sample: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('sample', { _id }, { group: 1 }, 'findOne')
          .then((sample) => {
            return query('project', { _id: sample.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    screen: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('screen', { _id }, { group: 1 }, 'findOne')
          .then((screen) => {
            return query('project', { _id: screen.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
  },
  checkProject: (project, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === project.lab
    ) {
      return true;
    } else if (user.email === project.ownerEmail) {
      return true;
    } else if (Permission.hasWritePermission(user.email, project.userPermission)) {
      return true;
    }
    return false;
  },
  checkProtocol: (protocol, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === protocol.lab
    ) {
      return true;
    } else if (user.email === protocol.creatorEmail) {
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
module.exports = Permission;
