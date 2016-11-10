describe('controller: alert', function() {
  var assert = chai.assert;
  var $controller;
  var alertController;
  var dialog;
  var helperReport;
  var $mdDialog;
  var report;
  var $rootScope;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    helperReport = $injector.get('helperReport');
    $mdDialog = $injector.get('$mdDialog');
    $rootScope = $injector.get('$rootScope');
    alertController = $controller('alert', {
      $scope: $rootScope,
      message: 'something',
      title: 'something'
    });
    dialog = sinon.stub($mdDialog, "hide");
    report = sinon.stub(helperReport, "mail");
  }));

  describe('when shown', function() {

    it('close button should hide diaglog', function() {
      alertController.close();
      assert.isTrue(dialog.calledOnce);
    });

    it('error button should call mailto helper', function() {
      alertController.reportError('test');
      assert.isTrue(report.calledOnce);
    });
  });

});
