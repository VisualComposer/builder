var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');

var Element = React.createClass({
    addChild: function() {
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    getContent: function() {
        let elementsList = this.props.data.map(function( element ) {
            let data = Array.prototype.slice.call(element.childNodes);
            return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data}
                            key={element.getAttribute('id')}/>;
        });
        return elementsList;
        return '';
    },
    render: function() {
        if(this.props.data.length) {
            return <div className="vc-v-tree-node">
                {['<', this.props.element.element, '>']}
                    {this.getContent()}
                {['</', this.props.element.element, '>']}</div>
        }
        return <div className="vc-v-tree-node">{['<', this.props.element.element, '/>']}</div>
    }
});
Mediator.installTo(Element);
module.exports = Element;