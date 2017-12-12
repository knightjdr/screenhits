const config = require('../../../config');
const moment = require('moment');
const njwt = require('njwt');

const SECRET = config.settings().secretKey;

const Token = {
  create: (user) => {
    const claims = {
      iss: 'screenhits.org',
      lab: user.lab,
      name: user.name,
      permissions: user.privilege,
      sub: user.email,
    };
    const tokenObj = njwt.create(claims, SECRET);
    // tokens will last for 7 days
    const expiryDate = moment().add(7, 'd');
    tokenObj.setExpiration(expiryDate);
    return tokenObj.compact();
  },
  verify: (authToken) => {
    return new Promise((resolve, reject) => {
      if (authToken) {
        njwt.verify(authToken, SECRET, (err, verifiedJwt) => {
          if (err) {
            reject();
          }
          resolve(verifiedJwt.body);
        });
      } else {
        reject();
      }
    });
  },
};
module.exports = Token;
