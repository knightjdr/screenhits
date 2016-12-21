describe('controller: profile', function() {
  var assert = chai.assert;
  var $controller;
  var __env;
  var helperDialog;
  var helperDialogAlert;
  var $http;
  var $httpBackend;
  var $rootScope;
  var screens;
  var screensSet;
  var $state;
  var successObject = {name: 'something'};
  var profile;

  beforeEach(module('app'));
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function($injector) {
    __env = $injector.get('__env');
    $controller = $injector.get('$controller');
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', __env.apiUrl + '/project/screen/?project=1&')
      .respond(function() {
        return [200, {status: 0, screens: successObject}];
      })
    ;
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    sinon.spy($state, 'go');
    screens = $injector.get('screens');
    screensSet = sinon.stub(screens, 'set');
    profile = $controller('profile', {
      $scope: $rootScope
    });
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

  describe('when screens updated', function() {

    it('screens object should be set', function() {
      $rootScope.$broadcast('screens:updated', {screen: 'screen'});
      assert.equal(profile.screens.screen, 'screen');
    });
  });

  describe('when project selected', function() {
    beforeEach(function() {
      //$httpBackend.expect('GET', __env.apiUrl + '/project/screen/?project=1&');
      profile.selectProject({_id: 1});
      //$httpBackend.flush();
    });

    /*it('screens object should be set', function() {
      assert.isTrue(screensSet.calledOnce);
      assert.isTrue(profile.screens.name, 'something');
    })*/

    it('state should change', function() {
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
