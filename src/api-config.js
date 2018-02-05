let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'screenhits.org') {
  backendHost = 'https://screenhits.org:8003';
} else {
  backendHost = 'http://localhost:8003';
}

const API_ROOT = `${backendHost}/api`;
export default API_ROOT;
