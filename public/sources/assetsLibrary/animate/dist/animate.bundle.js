/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__("./src/animate.js");
	module.exports = __webpack_require__("./src/animate.css");


/***/ },

/***/ "./src/animate.js":
/***/ function(module, exports) {

	'use strict';

	window.vcv.on('ready', function (action, id) {
	  // window.Waypoint.destroyAll()
	  var enableAnimate = function enableAnimate(id) {
	    var selector = id ? '[data-vcv-element="' + id + '"]' : '[data-vce-animate]';
	    var elements = document.querySelectorAll(selector);
	    elements = [].slice.call(elements);
	    elements.forEach(function (element) {
	      if (id && !element.getAttribute('data-vce-animate')) {
	        element = element.querySelector('[data-vce-animate]');
	        if (!element) {
	          return;
	        }
	      }
	      var $element = window.jQuery(element);
	      if ($element.data('vcvWaypoints')) {
	        $element.data('vcvWaypoints').destroy();
	      }
	      // remove old classes
	      var oldClasses = [];
	      var re = /^vce-o-animate--/;
	      element.classList.forEach(function (className) {
	        if (className.search(re) !== -1) {
	          oldClasses.push(className);
	        }
	      });
	      element.classList.remove.apply(element.classList, oldClasses);
	      var waypointObj = new window.Waypoint({
	        element: element,
	        handler: function handler() {
	          // add new classes
	          var newClasses = [];
	          if (element.dataset['vceAnimate']) {
	            newClasses = element.dataset['vceAnimate'].split(' ');
	          }
	          element.setAttribute('data-vcv-o-animated', 'true');
	          // newClasses.push('vce-o-animate--animated')
	          newClasses.forEach(function (className) {
	            element.classList.add(className);
	          });
	          waypointObj.destroy();
	        },
	        offset: '85%'
	      });
	      $element.data('vcvWaypoints', waypointObj);
	    });
	  };

	  if (action !== 'merge') {
	    enableAnimate(action && id ? id : '');
	  }
	});

/***/ },

/***/ "./src/animate.css":
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });