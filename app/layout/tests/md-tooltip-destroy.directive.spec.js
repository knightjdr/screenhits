describe('directive: md-tooltip-destroy', function() {
  var assert = chai.assert;
  var element;
  var scope;
  var tooltip;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    //dummy tooltip
    tooltip = document.createElement('md-tooltip');
    document.body.appendChild(tooltip);
    //create directive for testing
    element = '<md-button md-tooltip-destroy></md-button>';
    element = $compile(element)(scope);
  }));

  describe('when clicked', function() {
    beforeEach(function() {
      element.triggerHandler('click');
    });

    it('all clicks should destroy md-tooltips', function() {
      should.equal(document.getElementsByTagName('md-tooltip').length, 0);
    });
  });
});
