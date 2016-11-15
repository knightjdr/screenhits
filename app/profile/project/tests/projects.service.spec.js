describe('service: projects', function() {
  var assert = chai.assert;
  var projects;
  var $rootScope;
  var testData = [{_id: 1, value: 'something'}];

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    projects = $injector.get('projects');
    $rootScope = $injector.get('$rootScope');
    sinon.spy($rootScope, '$broadcast');
  }));

  describe('when project is set', function() {
    beforeEach(function() {
      projects.set(testData);
    });

    it('project array should be created', function() {
      assert.equal(projects.get().length, testData.length);
      assert.equal(projects.get().id, testData.id);
      assert.equal(projects.get().value, testData.value);
    });

    it('creation event should be broadcast', function() {
      assert.isTrue($rootScope.$broadcast.calledWith('projects:updated', testData));
    });

    describe('and new data is added', function() {

      it('projects array should increase in size', function() {
        projects.add(testData);
        assert.equal(projects.get().length, testData.length * 2);
      });
    });

    describe('and project is updated', function() {

      it('projects array should increase in size', function() {
        projects.update(1, 'value', 'something else');
        assert.equal(projects.get()[0].value, 'something else');
      });
    });
  });

});
