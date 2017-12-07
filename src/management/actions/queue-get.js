import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Queue = {
  get: (user) => {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
      const url = 'http://localhost:8003/queue?target=creation';
      fetch(
        url,
        {
          cache: 'default',
          headers,
          mode: 'cors',
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if (json.status === 200) {
            resolve(json.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        })
      ;
    });
  },
};
export default Queue;
