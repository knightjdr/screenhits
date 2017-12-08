const config = require('../../../../config');
const GoogleAuth = require('google-auth-library');

const auth = new GoogleAuth();
const CLIENT_ID = config.settings().googleClientID;
const client = new auth.OAuth2(CLIENT_ID, '', '');

const Validate = (token) => {
  return new Promise((resolve, reject) => {
    client.verifyIdToken(
      token,
      CLIENT_ID,
      (err, login) => {
        if (err) {
          reject('User could not be authenticated by Google');
        } else {
          const payload = login.getPayload();
          resolve(payload.email);
        }
      }
    );
  });
};
module.exports = Validate;
