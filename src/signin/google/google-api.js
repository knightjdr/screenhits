/* global gapi */

import googleClientID from './client-id';

const GoogleAPI = {
  auth: null,
  signin: () => {
    return new Promise((resolve, reject) => {
      const gapiOptions = {
        clientId: googleClientID,
        scope: 'email',
      };
      const signinOptions = {
        scope: 'email',
      };
      gapi.client.init(gapiOptions)
        .then(() => {
          GoogleAPI.auth = gapi.auth2.getAuthInstance();
          return GoogleAPI.auth.signIn(signinOptions);
        })
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
      if (GoogleAPI.auth.isSignedIn.get()) {
        GoogleAPI.auth.signOut()
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
