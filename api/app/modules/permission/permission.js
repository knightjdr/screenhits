const query = require('../query/query');

const Permission = {
  canEdit: {
    analysis: (_id, user, queuedTask = null) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        } else if (!queuedTask) { // if task is running or complete
          query.get('analysisTasks', { _id }, { lab: 1, userEmail: 1 }, 'findOne')
            .then((task) => {
              return Permission.checkEditTask(task, user) ?
                Promise.resolve()
                :
                Promise.reject()
              ;
            })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject('not authorized');
            })
          ;
        } else if (Permission.checkEditTask(queuedTask, user)) {
          resolve();
        } else {
          reject('not authorized');
        }
      });
    },
    experiment: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('experiment', { _id }, { group: 1 }, 'findOne')
          .then((experiment) => {
            return query.get('project', { _id: experiment.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkEditProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
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
            return Permission.checkEditProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
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
            return Permission.checkEditProtocol(protocol, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
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
            return query.get('project', { _id: sample.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkEditProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
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
            return query.get('project', { _id: screen.group.project }, {}, 'findOne');
          })
          .then((project) => {
            return Permission.checkEditProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    template: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('template', { _id }, { creatorEmail: 1 }, 'findOne')
          .then((template) => {
            return Permission.checkEditTemplate(template, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
  },
  canView: {
    analysis: (_id, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        Promise.all([
          query.get('analysisTasks', { _id }, {}, 'findOne'),
          query.get('taskPermissions', { _id: { $in: ['global', user.email] } }),
        ])
          .then((values) => {
            return Permission.checkViewTask(values[0], values[1], user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
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
            return Permission.checkViewProject(project, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
    projects: (projectsArr, user) => {
      return new Promise((resolve, reject) => {
        if (user.privilege === 'siteAdmin') {
          resolve(true);
        }

        query.get('project', { _id: { $in: projectsArr } }, { lab: 1, ownerEmail: 1, userPermission: 1 })
          .then((projects) => {
            return Permission.checkViewProjects(projects, user) ?
              Promise.resolve()
              :
              Promise.reject()
            ;
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject('not authorized');
          })
        ;
      });
    },
  },
  checkEditProject: (project, user) => {
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
  checkOwnProject: (project, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === project.lab
    ) {
      return true;
    } else if (user.email === project.ownerEmail) {
      return true;
    }
    return false;
  },
  checkEditProtocol: (protocol, user) => {
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
  checkEditTask: (task, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === task.lab
    ) {
      return true;
    } else if (user.email === task.userEmail) {
      return true;
    }
    return false;
  },
  checkEditTemplate: (template, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === template.lab
    ) {
      return true;
    } else if (user.email === template.creatorEmail) {
      return true;
    }
    return false;
  },
  checkViewProject: (project, user) => {
    if (
      user.privilege === 'labAdmin' &&
      user.lab === project.lab
    ) {
      return true;
    } else if (user.email === project.ownerEmail) {
      return true;
    } else if (Permission.hasReadPermission(user, project.lab, project.userPermission)) {
      return true;
    }
    return false;
  },
  checkViewProjects: (projects, user) => {
    return projects.every((project) => {
      return Permission.checkViewProject(project, user);
    });
  },
  checkViewTask: (task, customPermissions, user) => {
    // check if there is an exception allowing/blocking use access
    const exceptionCanView = () => {
      const userIndex = customPermissions.findIndex((item) => { return item._id === user.email; });
      // check if user has been given explicit access or access has been revoked
      if (userIndex > -1) {
        const taskUserIndex = customPermissions[userIndex].list.findIndex((listItem) => {
          return listItem.user === task.userEmail;
        });
        if (
          taskUserIndex > -1 &&
          customPermissions[userIndex].list[taskUserIndex].access
        ) {
          return true;
        } else if (
          taskUserIndex > -1 &&
          !customPermissions[userIndex].list[taskUserIndex].access
        ) {
          return false;
        }
      }

      // if no explicit access/denial has been made, check for global access
      const globalIndex = customPermissions.findIndex((item) => { return item._id === 'global'; });
      if (
        globalIndex > -1 &&
        customPermissions[globalIndex].list.includes(task.userEmail)
      ) {
        return true;
      }
      return false;
    };

    if (user.privilege === 'siteAdmin') {
      return true;
    } else if (
      user.privilege === 'labAdmin' &&
      user.lab === task.lab
    ) {
      return true;
    } else if (user.email === task.userEmail) {
      return true;
    } else if (exceptionCanView) {
      return true;
    }
    return false;
  },
  hasReadPermission: (user, projectLab, specialUsers) => {
    const userIndex = specialUsers.findIndex((specialUser) => {
      return specialUser.email === user.email;
    });
    if (
      userIndex > -1 &&
      specialUsers[userIndex].permission !== 'n'
    ) {
      return true;
    } else if (
      userIndex > -1 &&
      specialUsers[userIndex].permission === 'n'
    ) {
      return false;
    } else if (user.lab === projectLab) {
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
  isOwner: (_id, user) => {
    return new Promise((resolve, reject) => {
      if (user.privilege === 'siteAdmin') {
        resolve(true);
      }

      query.get('project', { _id }, { lab: 1, ownerEmail: 1 }, 'findOne')
        .then((project) => {
          return Permission.checkOwnProject(project, user) ?
            Promise.resolve()
            :
            Promise.reject()
          ;
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject('not authorized');
        })
      ;
    });
  },
};
module.exports = Permission;
