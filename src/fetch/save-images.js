import fetch from 'isomorphic-fetch';

import API_ROOT from '../api-config';

// retrieves queue from server
const Save = (route, body, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    headers.append('Content-Type', 'application/json');
    const url = `${API_ROOT}/${route}`;
    fetch(
      url,
      {
        cache: 'default',
        body: JSON.stringify(body),
        headers,
        method: 'POST',
        mode: 'cors',
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        resolve();
      } else {
        reject({
          title: 'Error',
          text: 'There was an error saving the image(s)',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error saving the image(s)',
      });
    });
  });
};
export default Save;
