describe('controller: signin', function() {
  var assert = chai.assert;
  var controller;
  var data;
  var scope;

  beforeEach(module('app'));
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('signin', {
      $scope: scope
    });
  }));

  describe('when signed in', function() {
    beforeEach(function() {
      data = {name: 'something'};
      scope.$broadcast('credentials:updated', data);
    });

    it('signin should be true', function() {
      assert.isTrue(controller.signedIn);
    });
  });

  describe('when signed out', function() {
    beforeEach(function() {
      data = {text: 'something'};
      scope.$broadcast('credentials:updated', data);
      scope.$broadcast('signin:updated', data);
    });

    it('signin should be false', function() {
      assert.isNotTrue(controller.signedIn);
      assert.equal(controller.signedInText, 'something');
    });
  });

});
