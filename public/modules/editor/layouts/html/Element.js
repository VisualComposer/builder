var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');

var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    getContent: function() {
        let elementsList = this.props.data.map(function( element ){
            let data = Array.prototype.slice.call(element.childNodes);
            return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data} key={Utils.createKey()}/>
        });
        elementsList.push((<div className="controls" key="{this.props.element.id}-controls"><a onClick={this.addChild}>Add</a></div>));
        return elementsList;
    },
    render: function() {
        var element = this.props.element;
        var Element = require('../../../elements/' + element.element + '/' + element.element +'.js');
        return React.createElement(Element, {key: Utils.createKey(), content: this.getContent()});
    }
});
Mediator.installTo(Element);
module.exports = Element;