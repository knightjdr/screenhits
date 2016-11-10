describe('service: helper-http', function() {
  var assert = chai.assert;
  var credentials;
  var endpoint = 'someplace';
  var __env;
  var $http;
  var successCallback;
  var failureCallback;
  var testApiUrl = 'http://somewhere';
  var user;

  beforeEach(module('app'));
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function($injector) {
    credentials = $injector.get('credentials');
    helperHTTP = $injector.get('helperHTTP');
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', testApiUrl + '/' + endpoint, {trigger: 'success'})
      .respond(function() {
        return [200, {status: 0, data: 'something'}];
      })
    ;
    $httpBackend.when('POST', testApiUrl + '/' + endpoint, {trigger: 'failure'})
      .respond(function() {
        return [200, {status: 1, data: 'something'}];
      })
    ;
    successCallback = sinon.spy();
    failureCallback = sinon.spy();
    user = sinon.stub(credentials, 'get');
    user.returns('');
    __env = $injector.get('__env');
    __env.apiUrl = testApiUrl;
  }));

  describe('when called', function() {

    it('successfully, should trigger success callback', function() {
      $httpBackend.expect('POST', testApiUrl + '/' + endpoint, {trigger: 'success'});
      helperHTTP.set(endpoint, {trigger: 'success'}, successCallback, failureCallback);
      $httpBackend.flush();
      assert.isTrue(successCallback.calledOnce);
    });

    it('unsuccessfully, should trigger failure callback', function() {
      $httpBackend.expect('POST', testApiUrl + '/' + endpoint, {trigger: 'failure'});
      helperHTTP.set(endpoint, {trigger: 'failure'}, successCallback, failureCallback);
      $httpBackend.flush();
      assert.isTrue(failureCallback.calledOnce);
    });
  });
});
