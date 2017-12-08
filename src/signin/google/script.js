// add google platform script to body (in app.jsx)

const platformScript = () => {
  const addScript = document.createElement('script');
  addScript.setAttribute('async', true);
  addScript.setAttribute('defer', true);
  addScript.setAttribute('onLoad', 'gapi.load("client:auth2")');
  addScript.setAttribute('src', 'https://apis.google.com/js/platform.js');
  document.body.appendChild(addScript);
};
export default platformScript;
