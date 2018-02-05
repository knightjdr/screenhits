import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Clear = (route, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    const url = `${process.env.API_ROOT}/${route}`;
    fetch(
      url,
      {
        cache: 'default',
        headers,
        method: 'DELETE',
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
          text: 'There was an error clearing the image(s)',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error clearing the image(s)',
      });
    });
  });
};
export default Clear;
