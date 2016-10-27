describe('service: signin-callbacks', function() {
  var assert = chai.assert;
  var auth = {ab: {access_token: 'some token'}, cd: {ig: 'user', U3: 'user@somewhere.com'}};
  var credentials;
  var signinCallbacks;

  beforeEach(module('app'));
  beforeEach(inject(function(_credentials_, $rootScope, _signinCallbacks_) {
    credentials = _credentials_;
    signinCallbacks = _signinCallbacks_;
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when success called', function() {
    beforeEach(function() {
      signinCallbacks.success(auth);
    });

    it('should populate credentials object', function() {
      assert.equal(credentials.get().email, 'user@somewhere.com');
      assert.equal(credentials.get().name, 'user');
      assert.equal(credentials.get().token, 'some token');
    });

    it('should broadcast signin', inject(function($rootScope) {
      assert.isTrue($rootScope.$broadcast.calledWith('signin:updated', {text: 'Signed in'}));
    }));
  });

  describe('when failure called', function() {
    beforeEach(function() {
      signinCallbacks.failure();
    });

    it('unsuccessful signin should give empty credentials object', function() {
      assert.isTrue(Object.keys(credentials.get()).length === 0 && credentials.get().constructor === Object);
    });

  });
});
