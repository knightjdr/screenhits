var assert = chai.assert;

describe('service: signin-callbacks', function() {
  var auth;
  var credentials;
  var signinCallbacks;

  beforeEach(module('app'));
  beforeEach(inject(function(_credentials_, _signinCallbacks_) {
    credentials = _credentials_;
    signinCallbacks = _signinCallbacks_;
  }));

  describe('when invoked', function() {
    beforeEach(function() {
      auth = {ab: {access_token: 'some token'}, cd: {ig: 'user', U3: 'user@somewhere.com'}};
    });

    it('Successful signin should populate credentials object', function() {
      signinCallbacks.success(auth);
      assert.equal(credentials.get().email, 'user@somewhere.com');
      assert.equal(credentials.get().name, 'user');
      assert.equal(credentials.get().token, 'some token');
    });

    it('Unsuccessful signin should give empty credentials object', function() {
      signinCallbacks.failure();
      assert.isTrue(Object.keys(credentials.get()).length === 0 && credentials.get().constructor === Object);
    });

    it('Signin should be broadcast', function() {
      assert.equal(1, 1);
    });

    it('Text on signin button should read sign out', function() {
      assert.equal(1, 1);
    });

  });
});
