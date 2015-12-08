var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');

var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.id);
        Element.publish('app:add');
    },
    getContent: function() {
        return '';
    },
    render: function() {
        var Element = require('../../elements/' + element.element + '/' + element.element +'.js');
        return React.createElement(Element, {key: Utils.createKey(), addChild: this.addChild.bind(this)}, this.getContent());
    }
});
Mediator.installTo(Element);
module.exports = Element;