describe('service: credentials', function() {
  var assert = chai.assert;
  var credentials;
  var $rootScope;
  var testUser = {email: 'user@somewhere.com', name: 'user', token: 'some token'};

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    credentials = $injector.get('credentials');
    $rootScope = $injector.get('$rootScope');
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when invoked', function() {
    beforeEach(function() {
      credentials.set(testUser);
    });

    it('should get user credentials', function() {
      assert.equal(credentials.get().email, 'user@somewhere.com');
      assert.equal(credentials.get().name, 'user');
      assert.equal(credentials.get().token, 'some token');
    });

    it('broadcasts credentials updated event', inject(function($rootScope){
      assert.isTrue($rootScope.$broadcast.calledWith('credentials:updated'));
    }));
  });
});
