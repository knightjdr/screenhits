const create = require('../create/create');

const Queue = {
  get: (target) => {
    return new Promise((resolve) => {
      switch (target) {
        case 'creation':
          Queue.creation()
            .then((creationObj) => {
              resolve({
                status: 200,
                clientResponse: {
                  status: 200,
                  message: 'Queue retrieved',
                  data: {
                    errors: creationObj.errors,
                    finished: creationObj.finished,
                    queue: creationObj.queue,
                  },
                },
              });
            })
          ;
          break;
        default:
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: 'Not a valid "target" for this route',
            },
          });
          break;
      }
    });
  },
  creation: () => {
    return new Promise((resolve) => {
      const queued = create.queue.running.map((sample, index) => {
        return {
          position: index + 1,
          sampleName: sample.body && sample.body.name ? sample.body.name : 'unknown',
          userName: sample.body && sample.body.creatorName ? sample.body.creatorName : 'unknown',
        };
      });
      resolve({
        finished: create.queue.finished,
        queue: queued,
        errors: create.queue.errors,
      });
    });
  },
};
module.exports = Queue;
