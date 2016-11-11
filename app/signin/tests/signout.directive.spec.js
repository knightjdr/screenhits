var gapi = { auth2: { getAuthInstance: function() { return { disconnect: function() { return { then: function(callback) { callback(); }}; }}; }}};

describe('directive: google-signout', function() {
  var assert = chai.assert;
  var $compile;
  var credentials;
  var credentialsSet;
  var element;
  var $rootScope;
  var testUser = {email: 'user@somewhere.com', name: 'user', token: 'some token'};

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    credentials = $injector.get('credentials');
    $rootScope = $injector.get('$rootScope');
    //stubs and spies
    credentialsSet = sinon.stub(credentials, 'set');
    sinon.spy($rootScope, '$broadcast');
    //add google API
    var gAPI = document.createElement('script');
    gAPI.type = 'text/javascript';
    gAPI.async = true;
    gAPI.src = 'https://apis.google.com/js/client:platform.js';
    document.head.appendChild(gAPI);
    //create button
    element = '<div google-signout></div>';
    element = $compile(element)($rootScope);
  }));

  describe('when invoked', function() {
    beforeEach(function() {
      element.triggerHandler('click');
    });

    it('credentials should be unset', function() {
      assert.isTrue(credentialsSet.calledOnce);
    });

    it('event should be broadcast', inject(function($rootScope) {
      assert.isTrue($rootScope.$broadcast.calledWith('signin:updated', {text: 'Sign in'}));
    }));
  });
});
