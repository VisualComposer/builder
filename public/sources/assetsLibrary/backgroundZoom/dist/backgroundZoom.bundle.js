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

	__webpack_require__("./src/backgroundZoom.js");
	module.exports = __webpack_require__("./src/backgroundZoom.css");


/***/ },

/***/ "./src/backgroundZoom.js":
/***/ function(module, exports) {

	'use strict';

	window.vcv.on('ready', function (action, id) {
	  if (action !== 'merge') {
	    var selector = id ? '[data-vcv-element="' + id + '"] [data-vce-assets-zoom]' : '[data-vce-assets-zoom]';
	    if (selector) {
	      var elements = document.querySelectorAll(selector);
	      elements = [].slice.call(elements);
	      elements.forEach(function (element) {
	        var scale = element.dataset.vceAssetsZoomScale;
	        var duration = element.dataset.vceAssetsZoomDuration;
	        var styleString = 'transform: scale(' + scale + '); transition: transform ' + duration + 's linear;';
	        var previousElementWaypoints = element.vcvWaypoints;
	        if (previousElementWaypoints) {
	          previousElementWaypoints.destroy();
	          element.setAttribute('style', '');
	        }
	        var waypointObj = new window.Waypoint({
	          element: element,
	          handler: function handler(a, b, c, d, e) {
	            element.setAttribute('style', styleString);
	            waypointObj.destroy();
	          },
	          offset: '85%'
	        });
	        element.vcvWaypoints = waypointObj;
	      });
	    }
	  }
	});

/***/ },

/***/ "./src/backgroundZoom.css":
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });