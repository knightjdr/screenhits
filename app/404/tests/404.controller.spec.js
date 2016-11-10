describe('controller: 404', function() {
  var assert = chai.assert;
  var $controller;
  var errorController;
  var helperReport;
  var report;
  var $rootScope;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    helperReport = $injector.get('helperReport');
    $rootScope = $injector.get('$rootScope');
    errorController = $controller('404', {
      $scope: $rootScope
    });
    report = sinon.stub(helperReport, "mail");
  }));

  describe('report error', function() {

    it('should call mailto helper', function() {
      errorController.reportError('test');
      assert.isTrue(report.calledOnce);
    });
  });

});
