/* global gapi */

import googleClientID from './client-id';

const GoogleAPI = {
  auth: null,
  authInit: () => {
    if (!GoogleAPI.auth) {
      const gapiOptions = {
        clientId: googleClientID,
        scope: 'email',
      };
      gapi.client.init(gapiOptions)
        .then(() => {
          GoogleAPI.auth = gapi.auth2.getAuthInstance();
        })
      ;
    }
  },
  signin: () => {
    return new Promise((resolve, reject) => {
      const signinOptions = {
        scope: 'email',
      };
      GoogleAPI.auth.signIn(signinOptions)
        .then((googleUser) => {
          const idToken = googleUser.getAuthResponse().id_token;
          resolve(idToken);
        })
        .catch((error) => {
          if (error.error !== 'popup_closed_by_user') {
            reject('Google authentication failed');
          }
          reject();
        })
      ;
    });
  },
  signout: () => {
    return new Promise((resolve, reject) => {
      if (
        GoogleAPI.auth &&
        GoogleAPI.auth.isSignedIn &&
        GoogleAPI.auth.isSignedIn.get()
      ) {
        GoogleAPI.auth.disconnect()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
        ;
      }
      resolve();
    });
  },
};
export default GoogleAPI;
