describe('service: signin-callbacks', function() {
  var assert = chai.assert;
  var auth = {ab: {access_token: 'some token'}, cd: {ig: 'user', U3: 'user@somewhere.com'}};
  var credentials;
  var __env;
  var $http;
  var httpResponse;
  var signinCallbacks;
  var successObject = {email: 'user@somewhere.com', name: 'user', permissions: 'some', token: 'some token'};
  var token = {token: 'some token'};

  beforeEach(module('app'));
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function($injector) {
    credentials = $injector.get('credentials');
    __env = $injector.get('__env');
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', __env.apiUrl + '/login')
      .respond(function() {
        return [200, {status: 0, user: successObject}];
      })
    ;
    $rootScope = $injector.get('$rootScope');
    signinCallbacks = $injector.get('signinCallbacks');
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when success called', function() {
    beforeEach(function() {
      $httpBackend.expect('POST', __env.apiUrl + '/login');
      signinCallbacks.success(auth);
      $httpBackend.flush();
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
