var assert = chai.assert;

describe('service: credentials', function() {
  var credentials;
  var testUser;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, _credentials_) {
    credentials = _credentials_;
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when invoked', function() {
    beforeEach(function() {
      testUser = {email: 'user@somewhere.com', name: 'user', token: 'some token'};
      credentials.set(testUser);
    });

    it('should get user credentials', function() {
      assert.equal(credentials.get().email, 'user@somewhere.com');
      assert.equal(credentials.get().name, 'user');
      assert.equal(credentials.get().token, 'some token');
    });

    it('broadcasts the event', inject(function($rootScope){
      assert.isTrue($rootScope.$broadcast.calledWith('credentials:updated'));
    }));
  });
});
