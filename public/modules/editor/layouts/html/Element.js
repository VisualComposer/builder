var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');

var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.id);
        Element.publish('app:add');
    },
    getContent: function() {
        return (<div className="vc-v-controls">
            <a onClick="{this.addChild.bind(this)}">add</a>
        </div>);
    },
    render: function() {
        var element = this.props.element;
        console.log(element);
        var Element = require('../../../elements/' + element.element + '/' + element.element +'.js');
        return React.createElement(Element, {key: Utils.createKey()}, this.getContent());
    }
});
Mediator.installTo(Element);
module.exports = Element;