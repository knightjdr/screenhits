const Logout = (email, token) => {
  return new Promise((resolve) => {
    console.log(email, token);
    // will need to first validate email to token, if fail resolve with 403
    // then logout, resolve with 500 is this fails
    if (true) {
      resolve({
        status: 200,
        clientResponse: {
          status: 200,
        },
      });
    } else {
      resolve({
        status: 403,
        clientResponse: {
          status: 403,
          message: 'User could not be signed out',
        },
      });
    }
  });
};
module.exports = Logout;
