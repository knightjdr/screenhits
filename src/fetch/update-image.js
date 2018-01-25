import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Update = (body, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    headers.append('Content-Type', 'application/json');
    const url = 'http://localhost:8003/image';
    fetch(
      url,
      {
        cache: 'default',
        body: JSON.stringify(body),
        headers,
        method: 'PUT',
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
          text: 'There was an error updating the image',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error updating the image',
      });
    });
  });
};
export default Update;
