import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Download = (route, queryString, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    const url = `http://localhost:8003/${route}?${queryString}`;
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
    });
  });
};
export default Download;
