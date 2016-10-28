describe('directive: flip', function() {
  var assert = chai.assert;
  var div;
  var element;
  var getElementByIDStub;
  var getElementsByTagNameStub;
  var scope;
  var tooltip;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    //dummy div to watch
    div = document.createElement('div');
    div.id = 'target';
    getElementByIDStub = sinon.stub(document, 'getElementById');
    document.getElementById.withArgs('target').returns(div);
    //dummy tooltip
    tooltip = document.createElement('md-tooltip');
    getElementsByTagNameStub = sinon.stub(document, 'getElementsByTagName');
    document.getElementsByTagName.withArgs('md-tooltip').returns([tooltip]);
    //create directive for testing
    element = '<md-button flip-menu="target" flip-menu-height="100px"></md-button>';
    element = $compile(element)(scope);
  }));

  afterEach(function() {
    getElementByIDStub.restore();
    getElementsByTagNameStub.restore();
  });

  describe('when invoked', function() {
    it('style parameters should be set on target element', function() {
      assert.equal(div.style.maxHeight, '0px');
      assert.equal(div.style.overflow, 'hidden');
      assert.equal(div.style.transformOrigin, 'left center');
      assert.equal(div.style.transform, 'rotateY(90deg)');
      assert.equal(div.style.webkitTransform, 'rotateY(90deg)');
    });
  });

  describe('when clicked', function() {
    beforeEach(function() {
      element.triggerHandler('click');
    });
    it('first click should set certain style parameters', function() {
      assert.equal(div.style.maxHeight, '100px');
      assert.equal(div.style.transform, 'rotateY(0deg)');
      assert.equal(div.style.webkitTransform, 'rotateY(0deg)');
    });
    it('second click should unset certain style parameters', function() {
      element.triggerHandler('click');
      assert.equal(div.style.maxHeight, '0px');
      assert.equal(div.style.transform, 'rotateY(90deg)');
      assert.equal(div.style.webkitTransform, 'rotateY(90deg)');
    });
    it('all clicks should destroy md-tooltips', function() {
      should.equal(document.getElementsByTagName('md-tooltip'), undefined);
    })
  });
});
