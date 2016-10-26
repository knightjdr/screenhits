var assert = chai.assert;

describe('directive: google-signin', function() {
  var auth;
  var element;
  var link;
  var scope;
  var script;

  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile) {
    link = document.createElement("link");
    document.head.appendChild(link);
    scope = $rootScope.$new();
    element = '<div id="google-signin" google-signin clientid="{{clientId}}"></div>';
    scope.clientId = '498894175021-2v85kl2dnmnsqsaqo94a5ls6gsjbj7u4';
    element = $compile(element)(scope);
    scope.$digest();
  }));

  describe('when invoked', function() {
    it('Roboto font should be loaded', function() {
      link = document.getElementsByTagName('link')[0];
      assert.equal(link.getAttribute('href'), 'https://fonts.googleapis.com/css?family=Roboto');
    });

    it('Google api source should be loaded', function() {
      script = document.getElementsByTagName('script')[0];
      assert.equal(script.getAttribute('src'), 'https://apis.google.com/js/client:platform.js');
    });
  });
});
