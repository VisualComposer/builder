var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var ElementComponents = require('../../../../helpers/ElementComponents');

var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    getContent: function() {
        if(this.props.data.length) {
            let elementsList = this.props.data.map(function( element ) {
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data}
                                key={element.getAttribute('id')}/>;
            });
            return <ul className="vc-v-tree-node-children">{elementsList}</ul>;
        }
        return '';
    },
    render: function() {
        var element = this.props.element;
        var ElementComponent = ElementComponents.get(element);
        return <li>
            <span className="glyphicon glyphicon-th"></span> {element.tagName}
            {'container' == ElementComponent.type ? this.getContent() : ''}</li>;
    }
});
Mediator.installTo(Element);
module.exports = Element;