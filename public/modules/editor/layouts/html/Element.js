var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var ElementsHelper = require('../../../../helpers/Elements');
require('./Element.less');
var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    getContent: function() {
        let elementsList = this.props.data.map(function( element ){
            let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data} key={element.getAttribute('id')}/>;
        });
        elementsList.push((<div className="controls" key="{this.props.element.id}-controls"><a onClick={this.addChild} className="glyphicon glyphicon-plus"></a></div>));
        return elementsList;
    },
    render: function() {
        var element = this.props.element;
        var Element = ElementsHelper.getElement(element);
        return React.createElement(Element, {key: Utils.createKey(), content: this.getContent()});
    }
});
Mediator.installTo(Element);
module.exports = Element;