import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Download = (route, body, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    headers.append('Content-Type', 'application/json');
    const url = `http://localhost:8003/${route}`;
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
        resolve(json.image);
      } else {
        reject({
          title: 'Error',
          text: 'There was an error retrieving the image',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error retrieving the image',
      });
    });
  });
};
export default Download;
