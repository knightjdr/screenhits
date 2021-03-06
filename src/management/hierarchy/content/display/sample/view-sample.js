import fetch from 'isomorphic-fetch';

// retrieves queue from server
const View = (_id, name, format, authToken) => {
  // determine window width
  const width = window.innerWidth > 600 ? 600 : window.innerWidth;
  // open window
  const newWindow = window.open(
    '',
    'sample',
    `width=${width}, height=${window.innerHeight}, scrollbars=1, resizable=1`
  );
  newWindow.document.write('retrieving sample information...');
  newWindow.document.close();

  const errorWindow = () => {
    newWindow.document.write('There was an error retrieving this sample');
  };
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Auth-Token', authToken);
  const url = `${process.env.API_ROOT}/sample?target=${_id}&format=${format}`;
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
      newWindow.document.write(`<title>${name}</title>`);
      newWindow.document.write(json.data);
    } else {
      errorWindow();
    }
  })
  .catch(() => {
    errorWindow();
  });
};
export default View;
