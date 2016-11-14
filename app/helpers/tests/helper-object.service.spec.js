describe('service: helper-object', function() {
  var assert = chai.assert;
  var helperObject;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    helperObject = $injector.get('helperObject');
  }));

  describe('when called', function() {

    it('should return false for an empty object', function() {
      assert.isFalse(helperObject.notEmpty({}));
    });

    it('should return true for a non empty object', function() {
      assert.isTrue(helperObject.notEmpty({something: 1}));
    });
  });
});
