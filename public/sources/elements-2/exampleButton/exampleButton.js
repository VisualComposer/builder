import {getService} from 'vc-cake';
getService('element-manager').add(
  {
  "tag": {
    "type": "string",
    "access": "system",
    "value": "exampleButton"
  },
  "name": {
    "type": "string",
    "access": "system",
    "value": "Example Button 1.0"
  },
  "category": {
    "type": "array",
    "access": "system",
    "value": [
      "General",
      "Buttons"
    ]
  },
  "color": {
    "type": "dropdown",
    "access": "public",
    "value": "red",
    "title": "Color",
    "options": {
      "data": "colors"
    }
  },
  "edit-form": {
    "type": "group",
    "access": "public",
    "value": ["color"]
  }
},
  // Component callback
  function() {
    "use strict";var _reactTransformCatchErrors2 = require("react-transform-catch-errors");var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);var _react = require("react");var _redboxReact = require("redbox-react");Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _components = { _$ExampleButton: { displayName: "ExampleButton" } };var _reactComponentWrapper = (0, _reactTransformCatchErrors3["default"])({ filename: "/Users/slavawpb/Documents/wpbakery/vc-five/public/sources/elements-2/exampleButton/Template.jsx", components: _components, locals: [], imports: [_react, _redboxReact] });function _wrapComponent(uniqueId) {return function (ReactClass) {return _reactComponentWrapper(ReactClass, uniqueId);};}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}var 
ExampleButton = (function (_Component) {_inherits(ExampleButton, _Component);function ExampleButton() {_classCallCheck(this, _ExampleButton);_get(Object.getPrototypeOf(_ExampleButton.prototype), "constructor", this).apply(this, arguments);}_createClass(ExampleButton, [{ key: "render", value: 
    function render() {var _props = 
      this.props;var key = _props.key;var content = _props.content;var other = _objectWithoutProperties(_props, ["key", "content"]);
      return React.createElement("button", { type: "button", className: "vce-example-button vc-example-button-{shape}", key: key }, 
      content);} }]);var _ExampleButton = ExampleButton;ExampleButton = _wrapComponent("_$ExampleButton")(ExampleButton) || ExampleButton;return ExampleButton;})(_react.Component);exports.ExampleButton = ExampleButton;
  },
  // css settings // css for element
  {},
  // javascript callback
  function(){},
  // editor js
 null
);