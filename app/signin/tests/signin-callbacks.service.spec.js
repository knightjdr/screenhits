var gapi = { auth2: { getAuthInstance: function() { return { disconnect: function() { return { then: function(callback) { callback(); }}; }}; }}};

describe('service: signin-callbacks', function() {
  var assert = chai.assert;
  var auth = {ab: {access_token: 'some token'}, cd: {ig: 'user', U3: 'user@somewhere.com'}};
  var credentials;
  var credentialsSet;
  var __env;
  var helperDialog;
  var helperDialogAlert;
  var $http;
  var $httpBackend;
  var projects;
  var projectsSet;
  var signinCallbacks;
  var successObject = {email: 'user@somewhere.com', name: 'user', permissions: 'some', token: 'some token'};
  var token = {token: 'some token'};

  beforeEach(module('app'));
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function($injector) {
    credentials = $injector.get('credentials');
    credentialsSet = sinon.stub(credentials, 'set');
    __env = $injector.get('__env');
    helperDialog = $injector.get('helperDialog');
    helperDialogAlert = sinon.stub(helperDialog, 'alert');
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', __env.apiUrl + '/login', {token: 'some token'})
      .respond(function() {
        return [200, {status: 0, user: successObject}];
      })
    ;
    $httpBackend.when('POST', __env.apiUrl + '/login', {})
      .respond(function() {
        return [200, {status: 1, user: successObject}];
      })
    ;
    projects = $injector.get('projects');
    projectsSet = sinon.stub(projects, 'set');
    $rootScope = $injector.get('$rootScope');
    signinCallbacks = $injector.get('signinCallbacks');
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when success called', function() {
    beforeEach(function() {
      $httpBackend.expect('POST', __env.apiUrl + '/login', {token: 'some token'});
      signinCallbacks.success(auth);
      $httpBackend.flush();
    });

    it('should populate credentials object', function() {
      assert.isTrue(credentialsSet.calledOnce);
    });

    it('should broadcast signin', inject(function($rootScope) {
      assert.isTrue($rootScope.$broadcast.calledWith('signin:updated', {text: 'Signed in'}));
    }));

    it('should populate projects object', function() {
      assert.isTrue(projectsSet.calledOnce);
    });
  });

  describe('when failure called', function() {
    beforeEach(function() {
      $httpBackend.expect('POST', __env.apiUrl + '/login', {});
      signinCallbacks.success({});
      $httpBackend.flush();
    });

    it('should launch dialog', function() {
      assert.isTrue(helperDialogAlert.calledOnce);
    });

  });

  describe('when failure called', function() {
    beforeEach(function() {
      signinCallbacks.failure();
    });

    it('unsuccessful signin should give empty credentials object', function() {
      assert.isTrue(credentialsSet.calledOnce);
    });

  });
});
