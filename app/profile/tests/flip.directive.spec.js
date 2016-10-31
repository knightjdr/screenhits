describe('directive: flip', function() {
  var assert = chai.assert;
  var div;
  var element;
  var scope;
  var checkDiv;
  var tooltip;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    //dummy div to watch
    div = document.createElement('div');
    div.id = 'target';
    document.body.appendChild(div);
    //dummy tooltip
    tooltip = document.createElement('md-tooltip');
    document.body.appendChild(tooltip);
    //create directive for testing
    element = '<md-button flip-menu="target" flip-menu-height="100px"></md-button>';
    element = $compile(element)(scope);
  }));

  describe('when invoked', function() {
    it('style parameters should be set on target element', function() {
      checkDiv = document.getElementById('target');
      assert.equal(checkDiv.style.maxHeight, '0px');
      assert.equal(checkDiv.style.overflow, 'hidden');
      assert.equal(checkDiv.style.transformOrigin, 'left center');
      assert.equal(checkDiv.style.transform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(90deg)');
    });
  });

  describe('when clicked', function() {
    beforeEach(function() {
      element.triggerHandler('click');
      checkDiv = document.getElementById('target');
    });
    it('first click should set certain style parameters', function() {
      assert.equal(checkDiv.style.transition, 'all 750ms');
      assert.equal(checkDiv.style.maxHeight, '100px');
      assert.equal(checkDiv.style.transform, 'rotateY(0deg)');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(0deg)');
    });
    it('second click should unset certain style parameters', function() {
      element.triggerHandler('click');
      assert.equal(checkDiv.style.maxHeight, '0px');
      assert.equal(checkDiv.style.transform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(90deg)');
    });
    it('all clicks should destroy md-tooltips', function() {
      should.equal(document.getElementsByTagName('md-tooltip').length, 0);
    });
  });
});
