describe('controller: 404', function() {
  var assert = chai.assert;
  var controller;
  var scope;

  beforeEach(module('app'));
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('404', {
      $scope: scope
    });
  }));

  describe('when created', function() {
    beforeEach(function() {
      controller.supportEmail = 'user@somewhere.com';
      scope.$digest();
      controller.reportError('test');
    });

    it('report error should open mailto window', function() {
      assert.equal(controller.windowLocation, 'mailto:'+ controller.supportEmail + '?subject=' + 'test');
    });
  });

});
