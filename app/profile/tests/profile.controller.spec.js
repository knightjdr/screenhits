describe('controller: profile', function() {
  var assert = chai.assert;
  var $controller;
  var $rootScope;
  var $state;
  var profile;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    profile = $controller('profile', {
      $scope: $rootScope
    });
    sinon.spy($state, 'go');
  }));

  describe('when credentials updated', function() {

    it('user name should be set', function() {
      $rootScope.$broadcast('credentials:updated', {name: 'something'});
      assert.equal(profile.user, 'something');
    });
  });

  describe('when projects updated', function() {

    it('project object should be set', function() {
      $rootScope.$broadcast('projects:updated', {project: 'project'});
      assert.equal(profile.projects.project, 'project');
    });
  });

  describe('when project selected', function() {

    it('state should change', function() {
      profile.selectProject({_id: 1});
      assert.isTrue($state.go.calledWith('root.projects.details', {project: 1}));
    });
  });

  describe('when new project select', function() {

    it('state should change', function() {
      profile.newProject();
      assert.isTrue($state.go.calledWith('root.projects.new'));
    });
  });
});
