'use strict';

var $ = require('jquery');
require('./dist/js/jquery.fancybox.cjs.js')($);
var assert = require('chai').assert;

assert.strictEqual($.fancybox.version, '2.1.5');
console.log('success');

phantom.exit();
