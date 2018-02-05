import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Queue = {
  get: (token) => {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Auth-Token', token);
      const url = `${process.env.API_ROOT}/queue?target=creation`;
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
