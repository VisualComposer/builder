var React = require('react');

var Mediator = require( '../Mediator' );
var DataService = Mediator.getService('data');
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
        return require('../../sources/attributes/' + this.attributeName + '/Component');
    },
    // @todo add lodash to write via curry/compose
    getElementValue: function(name, settings, element) {
        this.setName(name);
        this.setSettings(settings);
        if('system' !== this.settings.getAccess()) {
            return this.getValue(element);
        }
        return null;
    },
    getElement: function(name, settings, element) {
        this.setName(name);
        this.setSettings(settings);
        if('public' === this.settings.getAccess()) {
            var ComponentView = this.getComponent();
            return React.createElement(ComponentView, {
                value: this.getValue(element),
                key: Mediator.getService('utils').createKey(),
                element: element,
                name: this.name
            });
        }
        return Nothing(this);
    },
    getValue: function(element) {
        var Getter = require('../../sources/attributes/' + this.attributeName + '/Getter');
        return Getter(element, this.name);
    },
};

module.exports = Mediator.addService('attributes', Attributes);

