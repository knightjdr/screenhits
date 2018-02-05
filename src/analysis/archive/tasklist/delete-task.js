import fetch from 'isomorphic-fetch';

import API_ROOT from '../../../api-config';

// retrieves queue from server
const Delete = (_id, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    const url = `${API_ROOT}/analysis/tasks/${_id}`;
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
