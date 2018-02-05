/* global Blob */

import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Download = (filename, format, queryString, route, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    const url = `${process.env.API_ROOT}/${route}?${queryString}`;
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
        const blob = new Blob([json.data], { type: json.contentType });
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('type', 'hidden');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.${format}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        resolve();
      } else {
        reject({
          title: 'Error',
          text: 'There was an error downloading this file',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error downloading this file',
      });
    });
  });
};
export default Download;
