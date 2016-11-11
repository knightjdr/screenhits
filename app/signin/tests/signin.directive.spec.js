describe('directive: google-signin', function() {
  var assert = chai.assert;
  var $compile;
  var element;
  var link;
  var $rootScope;
  var script;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    //create link element for prepending font css
    link = document.createElement("link");
    document.head.appendChild(link);
    //create directive for testing
    element = '<div id="google-signin" google-signin clientid="testid"></div>';
    element = $compile(element)($rootScope);
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
