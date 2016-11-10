describe('service: helper-report', function() {
  var assert = chai.assert;
  var __env;
  var helperReport;
  var testEmail = 'someone@somewhere.com';
  var testSubject = 'something';
  var $window;
  var hrefString = 'mailto:'+ testEmail + '?subject=' + testSubject;

  beforeEach(module('app'));
  beforeEach(module(function($provide) {
    $provide.value('$window', {
      location: {href: ''}
    });
  }));
  beforeEach(inject(function($injector) {
    __env = $injector.get('__env');
    __env.supportEmail = testEmail;
    $window = $injector.get('$window');
    helperReport = $injector.get('helperReport');
  }));

  describe('when called', function() {

    it('should open a mailto window', function() {
      helperReport.mail(testSubject);
      assert.equal($window.location.href, hrefString);
    });
  });
});
