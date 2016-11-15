describe('directive: flip', function() {
  var assert = chai.assert;
  var checkDiv;
  var $compile;
  var div;
  var element;
  var $rootScope;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    //dummy div to watch
    div = document.createElement('div');
    div.id = 'target';
    document.body.appendChild(div);
    //create directive for testing
    element = '<md-button flip-menu="target" flip-menu-height="100px" flip-menu-width="100px"></md-button>';
    element = $compile(element)($rootScope);
  }));

  describe('when invoked', function() {
    it('style parameters should be set on target element', function() {
      checkDiv = document.getElementById('target');
      assert.equal(checkDiv.style.maxHeight, '0px');
      assert.equal(checkDiv.style.minWidth, '0px');
      assert.equal(checkDiv.style.overflow, 'hidden');
      assert.equal(checkDiv.style.transformOrigin, 'left center');
      assert.equal(checkDiv.style.transform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.visibility, 'hidden');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.width, '0px');
      assert.equal(checkDiv.style.whiteSpace, 'nowrap');
    });
  });

  describe('when clicked', function() {
    beforeEach(function() {
      element.triggerHandler('click');
      checkDiv = document.getElementById('target');
    });
    it('first click should set certain style parameters', function() {
      assert.equal(checkDiv.style.maxHeight, '100px');
      assert.equal(checkDiv.style.minWidth, '100px');
      assert.equal(checkDiv.style.transform, 'rotateY(0deg)');
      assert.equal(checkDiv.style.transition, 'all 500ms');
      assert.equal(checkDiv.style.visibility, 'visible');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(0deg)');
      assert.equal(checkDiv.style.width, 'auto');
    });
    it('second click should unset certain style parameters', function() {
      element.triggerHandler('click');
      assert.equal(checkDiv.style.maxHeight, '0px');
      assert.equal(checkDiv.style.minWidth, '0px');
      assert.equal(checkDiv.style.transform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.visibility, 'hidden');
      assert.equal(checkDiv.style.webkitTransform, 'rotateY(90deg)');
      assert.equal(checkDiv.style.width, '0px');
      assert.equal(checkDiv.style.whiteSpace, 'nowrap');
    });
  });
});
