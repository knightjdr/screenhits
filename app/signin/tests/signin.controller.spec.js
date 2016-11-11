describe('controller: signin', function() {
  var assert = chai.assert;
  var $controller;
  var $rootScope;
  var signin;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    signin = $controller('signin', {
      $scope: $rootScope
    });
  }));

  describe('when signed in correctly', function() {

    it('signin should be true and name set', function() {
      $rootScope.$broadcast('credentials:updated', {name: 'something'});
      assert.isTrue(signin.signedIn);
      assert.equal(signin.user, 'something');
    });
  });

  describe('when signed in incorrectly', function() {

    it('signin should be false', function() {
      $rootScope.$broadcast('credentials:updated', {});
      assert.isFalse(signin.signedIn);
    });
  });

  describe('when signed out', function() {

    it('signin should be false', function() {
      $rootScope.$broadcast('credentials:updated', {});
      $rootScope.$broadcast('signin:updated', {text: 'something'});
      assert.isFalse(signin.signedIn);
      assert.equal(signin.signedInText, 'something');
    });
  });

});
