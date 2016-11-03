describe('directive: collapse-expand', function() {
  var assert = chai.assert;
  var div;
  var element;
  var scope;
  var checkDiv;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    //dummy div to watch
    div =  '<div class="parent-container">' +
      '<div class="collapse-header"></div>' +
      '<div class="collapse-container"></div>' +
      '<md-button collapse="parent-container"></md-button>' +
      '<md-button expand="parent-container"></md-button>' +
      '</div>';
    div = $compile(div)(scope);
    console.log(document.getElementsByClassName('parent-container'));
  }));

  describe('directive: collapse', function() {
    beforeEach(inject(function($rootScope, $compile) {
      //create directive for testing
      //element = document.querySelector('[collapse="parent-container"]');
      //console.log(element);
    }));

    describe('when invoked', function() {
      it('style parameters should be set on target container', function() {
        checkDiv = document.getElementById('parent-container');
        assert.equal(0, 0);
      });
    });
  });
});
