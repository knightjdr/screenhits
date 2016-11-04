describe('directive: collapse-expand', function() {
  var assert = chai.assert;
  var closeIcons;
  var collapseButton;
  var collapseTarget;
  var containerHeader;
  var div;
  var expandButton;
  var scope;
  var checkDiv;

  beforeEach(module('app'));
  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    div = document.createElement('div');
    div.id = 'test';
    div.className = 'parent-container';
    div = document.body.appendChild(div);
    closeIcons = document.createElement('div');
    closeIcons.className = 'collapse-icons-other';
    closeIcons = div.appendChild(closeIcons);
    containerHeader = document.createElement('div');
    containerHeader.className = 'collapse-header';
    containerHeader = div.appendChild(containerHeader);
    collapseTarget = document.createElement('div');
    collapseTarget.className = 'collapse-container';
    collapseTarget = div.appendChild(collapseTarget);
    collapseButton = document.createElement('md-button');
    collapseButton.setAttribute('collapse', 'parent-container');
    collapseButton = div.appendChild(collapseButton);
    expandButton = document.createElement('md-button');
    expandButton.setAttribute('expand', 'parent-container');
    expandButton = div.appendChild(expandButton);
    collapseButton = $compile(collapseButton)(scope);
    expandButton = $compile(expandButton)(scope);
  }));

  describe('directive: collapse', function() {

    describe('when invoked', function() {
      it('style parameters should be set on target container', function() {
        assert.equal(collapseTarget.style.transition, 'all 500ms');
        assert.equal(collapseTarget.style.webkitTransition, 'all 500ms');
      });
    });

    describe('when invoked', function() {
      it('style parameters should be set on header', function() {
        assert.equal(containerHeader.style.transition, 'all 500ms');
        assert.equal(containerHeader.style.webkitTransition, 'all 500ms');
      });
    });

    describe('when clicked', function() {
      it('style parameters should be set on various targets', function() {
        collapseButton.triggerHandler('click');
        assert.equal(closeIcons.style.display, 'none');
        assert.equal(collapseTarget.style.display, 'none');
        assert.equal(containerHeader.style.display, 'block');
        assert.equal(collapseButton[0].style.display, 'none');
        assert.equal(expandButton[0].style.display, 'inline');
      });
    });
  });

  describe('directive: expand', function() {

    describe('when invoked', function() {
      it('style parameters should be set on target container', function() {
        assert.equal(expandButton[0].style.display, 'none');
      });
    });

    describe('when clicked', function() {
      it('style parameters should be set on various targets', function() {
        expandButton.triggerHandler('click');
        assert.equal(closeIcons.style.display, 'inline');
        assert.equal(collapseTarget.style.display, 'inline');
        assert.equal(containerHeader.style.display, 'none');
        assert.equal(collapseButton[0].style.display, 'inline');
        assert.equal(expandButton[0].style.display, 'none');
      });
    });
  });
});
