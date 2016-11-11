describe('directive: md-tooltip-destroy', function() {
  var assert = chai.assert;
  var $compile;
  var element;
  var $rootScope;
  var tooltip;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    //dummy tooltip
    tooltip = document.createElement('md-tooltip');
    document.body.appendChild(tooltip);
    //create directive for testing
    element = '<md-button md-tooltip-destroy></md-button>';
    element = $compile(element)($rootScope);
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
