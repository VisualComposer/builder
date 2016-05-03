var React = require('react');
var vcCake = require('vc-cake');
// @todo add Nothing/Maybe monad :)
var Nothing = function(object) {
  object.setName(null);
  object.setSettings(null);
  return null;
};

var Attributes = {
  settings: null,
  name: null,
  attributeName: null,
  setName: function(name) {
    this.name = name;
    return this;
  },
  setSettings: function(settings) {
    this.settings = settings;
    this.attributeName = this.settings ? this.settings.getType().toLowerCase() : null;
    return this;
  },
  getComponent: function() {
    return require('../../../../sources/attributes/' + this.attributeName + '/Component');
  },
  // @todo add lodash to write via curry/compose
  getElementValue: function(name, settings, element) {
    this.setName(name);
    this.setSettings(settings);
    if ('system' !== this.settings.getAccess()) {
      return this.getValue(element);
    }
    return null;
  },
  getElement: function(name, settings, element, RulesManager) {
    this.setName(name);
    this.setSettings(settings);
    if ('public' === this.settings.getAccess()) {
      var ComponentView = this.getComponent();
      // var value = this.getValue(element);
      //var settings = this.settings.getSettings();
      return React.createElement(ComponentView, {
        value: this.getValue(element),
        key: vcCake.getService('utils').createKey(),
        element: element,
        settings: this.settings,
        rulesManager: RulesManager,
        name: this.name
      });
    }
    return new Nothing(this);
  },
  getValue: function(element) {
    // var Getter = require('../../../../sources/attributes/' + this.attributeName + '/Getter');
    return element[this.name]; // todo fix maxlength/class/style names with prefix-postfix and fix default value
  },
};

module.exports = Attributes;

