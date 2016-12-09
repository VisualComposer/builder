<?php
$groups = vchelper('WpWidgets')->allGrouped();
$scripts = [];
if (!empty($groups['default'])) {
    $scripts['WpWidgetsDefault'] = [
        'title' => 'Default WordPress Widget',
        'elements' => $groups['default'],
    ];
}
if (!empty($groups['custom'])) {
    $scripts['WpWidgetsCustom'] = [
        'title' => 'Custom WordPress Widget',
        'elements' => $groups['custom'],
    ];
}

foreach ($scripts as $key => $data) :
    $title = $data['title'];
?>
webpackJsonp(['wpWidgets-<?php echo $key; ?>'],[
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var _extends2 = __webpack_require__(120);

    var _extends3 = _interopRequireDefault(_extends2);

    var _keys = __webpack_require__(158);

    var _keys2 = _interopRequireDefault(_keys);

    var _getPrototypeOf = __webpack_require__(162);

    var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

    var _classCallCheck2 = __webpack_require__(166);

    var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

    var _createClass2 = __webpack_require__(167);

    var _createClass3 = _interopRequireDefault(_createClass2);

    var _possibleConstructorReturn2 = __webpack_require__(171);

    var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

    var _inherits2 = __webpack_require__(206);

    var _inherits3 = _interopRequireDefault(_inherits2);

    var _vcCake = __webpack_require__(214);

    var _vcCake2 = _interopRequireDefault(_vcCake);

    var _react = __webpack_require__(232);

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    var addElement = _vcCake2.default.getService('cook').add;
    var vcvAPI = _vcCake2.default.getService('api');
    addElement({
      "name": {
        "type": "string",
        "access": "protected",
        "value": "<?php echo $title; ?>"
      },
      "metaIntro": {
        "type": "textarea",
        "access": "protected",
        "value": "Short intro"
      }, "metaDescription": {
        "type": "textarea",
        "access": "protected",
        "value": "Long description"
      }, "metaPreviewDescription": {
        "type": "textarea",
        "access": "protected",
        "value": "Medium preview description"
      }, "metaPreview": {
        "type": "attachimage",
        "access": "protected",
        "value": "preview.jpg"
      },
      "metaThumbnail": {
        "type": "attachimage",
        "access": "protected",
        "value": "thumbnail.jpg"
      },
      "ajaxForm": {
        "type": "ajaxForm",
        "access": "public",
        "value": {},
        "options": {
          "label": "Ajax Form",
          "action": "vcv:wpWidgets:form",
          "data": {
            "widgetKey": "<?php echo array_keys($data['elements'])[0]; ?>"
          }
        }
      },
      "designOptions": {
        "type": "designOptions",
        "access": "public",
        "value": {},
        "options": {
          "label": "Design Options"
        }
      }, "metaEditFormTabs": {
        "type": "group",
        "access": "protected",
        "value": [ "ajaxForm", "designOptions" ]
      }, "relatedTo": {
        "type": "group",
        "access": "protected",
        "value": [ "General" ]
      }, "tag": {
        "access": "protected",
        "type": "string",
        "value": "<?php echo $key; ?>"
      }
    },
      // Component callback
      function (component) {
        //
        component.add( /* global React, vcvAPI, vcCake */
          /* eslint no-unused-vars: 0 */
          function (_vcvAPI$elementCompon) {
            (0, _inherits3.default)(Component, _vcvAPI$elementCompon);

            function Component() {
              var _ref;

              var _temp, _this, _ret;

              (0, _classCallCheck3.default)(this, Component);

              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Component.__proto__ || (0, _getPrototypeOf2.default)(Component)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
                shortcodeContent: { __html: '' }
              }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
            }

            (0, _createClass3.default)(Component, [{
              key: 'componentDidMount',
              value: function componentDidMount() {
                this.requestToServer();
              }
            }, {
              key: 'componentDidUpdate',
              value: function componentDidUpdate(prevProps) {
                var isEqual = __webpack_require__(218).isEqual;
                if (!isEqual(this.props.atts, prevProps.atts)) {
                  this.requestToServer();
                }
              }
            }, {
              key: 'requestToServer',
              value: function requestToServer() {
                var _this2 = this;

                var ajax = function ajax(data, successCallback, failureCallback) {
                  var request = void 0;
                  request = new window.XMLHttpRequest();
                  request.open('POST', window.vcvAjaxUrl, true);
                  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                  request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                      successCallback(request);
                    } else {
                      if (typeof failureCallback === 'function') {
                        failureCallback(request);
                      }
                    }
                  };
                  request.send(window.$.param(data));

                  return request;
                };

                if (this.serverRequest) {
                  this.serverRequest.abort();
                }
                this.serverRequest = ajax({
                  'vcv-action': 'elements:widget' + (this.props.clean ? ':clean' : '') + ':adminNonce',
                  'vcv-nonce': window.vcvNonce,
                  'vcv-widget-key': '<?php echo $key; ?>',
                  'vcv-atts': {}
                }, function (result) {
                  _this2.setState({
                    shortcodeContent: { __html: result.response }
                  });
                });
              }
            }, {
              key: 'render',
              value: function render() {
                var _props = this.props,
                  id = _props.id,
                  atts = _props.atts,
                  editor = _props.editor;
                var designOptions = atts.designOptions;


                var customProps = {};
                var devices = designOptions.visibleDevices ? (0, _keys2.default)(designOptions.visibleDevices) : [];
                var animations = [];
                devices.forEach(function (device) {
                  var prefix = designOptions.visibleDevices[device];
                  if (designOptions[device].animation) {
                    if (prefix) {
                      prefix = '-' + prefix;
                    }
                    animations.push('vce-o-animate--' + designOptions[device].animation + prefix);
                  }
                });
                if (animations.length) {
                  customProps['data-vce-animate'] = animations.join(' ');
                }
                return _react2.default.createElement(
                  'div',
                  (0, _extends3.default)({ className: 'vce vce-widgets-wrapper' }, customProps, { id: 'el-' + id }, editor),
                  _react2.default.createElement('div', { dangerouslySetInnerHTML: this.state.shortcodeContent || { __html: '' } })
                );
              }
            }]);
            return Component;
          }(vcvAPI.elementComponent));
      },
      // css settings // css for element
      { "css": ".vce-widgets-wrapper {\r\n  position: relative;\r\n}\r\n\r\n.vce-widgets-wrapper[data-vcv-element]::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 999;\r\n}\r\n", "editorCss": false },
      // javascript callback
      '');

/***/ }
]);
<?php endforeach; ?>
