var gapi = { auth2: { getAuthInstance: function() { return { disconnect: function() { return { then: function(callback) { callback(); }}; }}; }}};

describe('directive: google-signout', function() {
  var assert = chai.assert;
  var credentials;
  var element;
  var scope;
  var testUser;

  beforeEach(module('app'));
  beforeEach(inject(function($compile, _credentials_, $rootScope) {
    credentials = _credentials_;
    scope = $rootScope.$new();
    sinon.spy($rootScope, '$broadcast');
    //add google API
    var gAPI = document.createElement('script');
    gAPI.type = 'text/javascript';
    gAPI.async = true;
    gAPI.src = 'https://apis.google.com/js/client:platform.js';
    document.head.appendChild(gAPI);
    //create button
    element = '<div google-signout></div>';
    element = $compile(element)(scope);
  }));

  describe('when invoked', function() {
    beforeEach(function() {
      testUser = {email: 'user@somewhere.com', name: 'user', token: 'some token'};
      credentials.set(testUser);
      element.triggerHandler('click');
    });

    it('credentials should be unset', function() {
      assert.isTrue(Object.keys(credentials.get()).length === 0 && credentials.get().constructor === Object);
    });

    it('event should be broadcast', inject(function($rootScope) {
      assert.isTrue($rootScope.$broadcast.calledWith('signin:updated', {text: 'Sign in'}));
    }));
  });
});
