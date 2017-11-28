import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Delete = (_id, user) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    const url = `http://localhost:8003/analysis/tasks/${_id}`;
    fetch(
      url,
      {
        cache: 'no-store',
        headers,
        method: 'delete',
        mode: 'cors',
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        resolve(json.message);
      } else {
        reject(json.message);
      }
    })
    .catch(() => {
      reject('There was an error cancelling/deleting this task');
    });
  });
};
export default Delete;
