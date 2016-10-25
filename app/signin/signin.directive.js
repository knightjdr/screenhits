/*
 * angular-google-plus-directive v0.0.2
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 * Modified by Boni Gopalan to include Google oAuth2 Login.
 * Modified by @barryrowe to provide flexibility in clientid, and rendering
 * Modified by James Knight
 */

(function() {
	'use strict';

	angular.module('app')
		.directive('googleSignin', ['credentials', function (credentials) {
         var ending = /\.apps\.googleusercontent\.com$/;
         return {
             restrict: 'A',
             link: function (scope, element, attrs) {
                 attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');
								 attrs.$set('data-clientid', attrs.clientid);
                 var defaults = {
                     onsuccess: onSignIn,
                     cookiepolicy: 'single_host_origin',
                     onfailure: onSignInFailure,
                     scope: 'email',
										 access_type: 'offline',
                     customtargetid: 'google-signin'
                 };
                 defaults.clientid = attrs.clientid;

                 function onSignIn(authResult) {
									 var data = {};
									 for(var key in authResult) {
											if(typeof(authResult[key]) === 'object') {
												if(authResult[key].hasOwnProperty('U3')) {
													data.email = authResult[key].U3;
												}
												if(authResult[key].hasOwnProperty('ig')) {
													data.name = authResult[key].ig;
												}
												if(authResult[key].hasOwnProperty('access_token')) {
													data.token = authResult[key].access_token;
												}
											}
										}
										credentials.set(data);
										document.getElementsByClassName('google-text')[0].innerHTML = 'Signed in';
                 }
                 function onSignInFailure(err) {
									 	credentials.set({});
                 }

                 // Asynchronously load the G+ SDK and font
								 var links = document.getElementsByTagName('link')[0];
								 var gPlusFont = document.createElement('link');
                 gPlusFont.type = 'text/css';
                 gPlusFont.async = true;
								 gPlusFont.rel = 'stylesheet';
                 gPlusFont.href = 'https://fonts.googleapis.com/css?family=Roboto';
								 links.parentNode.insertBefore(gPlusFont, links);
								 var scripts = document.getElementsByTagName('script')[0];
                 var gPlusSource = document.createElement('script');
                 gPlusSource.type = 'text/javascript';
                 gPlusSource.async = true;
                 gPlusSource.src = 'https://apis.google.com/js/client:platform.js';
								 scripts.parentNode.insertBefore(gPlusSource, scripts);
								 gPlusSource.onload = function () {
									 gapi.load('auth2', function () {
										 var auth2 = gapi.auth2.init({
											 client_id: defaults.clientid,
											 cookie_policy: defaults.cookiepolicy
										 });
										 auth2.attachClickHandler(defaults.customtargetid, {}, defaults.onsuccess, defaults.onfailure);
									 });
                 }
							;
						}
         };
  		}])
		;
})();
