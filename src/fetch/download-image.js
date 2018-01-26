import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Download = (route, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    const url = `http://localhost:8003/${route}`;
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
        resolve({
          image: json.image,
          metadata: json.metadata,
        });
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
