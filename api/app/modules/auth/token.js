const config = require('../../../config');
const moment = require('moment');
const njwt = require('njwt');
const update = require('../crud/update');

const SECRET = config.settings().secretKey;

const Tokens = {
  create: (user) => {
    const claims = {
      iss: 'screenhits.org',
      permissions: user.privilege,
      sub: user.email,
    };
    const tokenObj = njwt.create(claims, SECRET);
    // tokens will last for 7 days
    const expiryDate = moment().add(7, 'd');
    tokenObj.setExpiration(expiryDate);
    return tokenObj.compact();
  },
  updateExpiredTokens: (email, tokens, newToken) => {
    return new Promise((resolve, reject) => {
      const newTokens = tokens.filter((token) => {
        try {
          njwt.verify(token, SECRET);
        } catch (e) {
          return false;
        }
        return true;
      });
      newTokens.push(newToken);
      update.insert('users', { email }, { $set: { tokens: newTokens } })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        })
      ;
    });
  },
};
module.exports = Tokens;
