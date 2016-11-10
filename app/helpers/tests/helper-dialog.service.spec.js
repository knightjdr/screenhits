describe('service: helper-dialog', function() {
  var assert = chai.assert;
  var __env;
  var helperDialog;
  var dialog;
  var $mdDialog;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $mdDialog = $injector.get('$mdDialog');
    helperDialog = $injector.get('helperDialog');
    dialog = sinon.stub($mdDialog, 'show');
  }));

  describe('when called', function() {

    it('should open a dialog window', function() {
      helperDialog.alert('title', 'message');
      assert.isTrue(dialog.calledOnce);
    });
  });
});
