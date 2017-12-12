const TokenLogin = (res) => {
  return new Promise((resolve) => {
    resolve({
      status: 200,
      clientResponse: {
        status: 200,
        user: {
          name: res.locals.user.name,
          privilege: res.locals.user.privilege,
        },
      },
    });
  });
};
module.exports = TokenLogin;
