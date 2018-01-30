import fetch from 'isomorphic-fetch';

// retrieves queue from server
const Export = (filename, body, authToken) => {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', authToken);
    headers.append('Content-Type', 'application/json');
    const url = 'http://localhost:8003/image/export';
    fetch(
      url,
      {
        body: JSON.stringify(body),
        cache: 'default',
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
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('type', 'hidden');
        link.href = json.uri;
        link.download = `${filename}.zip`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        resolve();
      } else {
        reject({
          title: 'Error',
          text: 'There was an error exporting the image(s)',
        });
      }
    })
    .catch(() => {
      reject({
        title: 'Error',
        text: 'There was an error exporting the image(s)',
      });
    });
  });
};
export default Export;
