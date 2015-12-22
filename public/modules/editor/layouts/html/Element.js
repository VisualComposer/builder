var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var ElementComponents = require('../../../../helpers/ElementComponents');
var ReactDOM = require('react-dom');
require('./Element.less');

var SortableMixin = {
	componentDidMount: function () {
		var component = ReactDOM.findDOMNode( this );
		$( component ).sortable( {
			animation: 150,
			forceFallback: true,
            onStart: function (/**Event*/evt) {
                $('#vc_v-editor').addClass('vc-draganddrop');
                // evt.oldIndex;  // element index within parent
            },
            // dragging ended
            onEnd: function (/**Event*/evt) {
                $('#vc_v-editor').removeClass('vc-draganddrop');
                // evt.oldIndex;  // element's old index within parent
                // evt.newIndex;  // element's new index within parent
            },
			onUpdate: function ( ev ) {
				var $el = $( ev.item );
				Element.publish( 'data:move',
					$el.data( 'vcElement' ),
					$el.next( '[data-vc-element]' ).data( 'vcElement' ) );
			}
		} );
	}
};
require('./Sortable.less');
var Element = React.createClass({
	mixins: [SortableMixin],
    addChild: function() {
        Element.publish('data:activeNode', this.props.element.getAttribute('id'));
        Element.publish('app:add', true);
    },
    editElement: function() {
      Element.publish('app:edit', this.props.element);
    },
    removeElement: function() {
        Element.publish('data:remove', this.props.element.getAttribute('id'));
    },
    cloneElement: function() {
        Element.publish('data:clone', this.props.element.getAttribute('id'));
    },
    getContent: function() {
        var ElementComponent = ElementComponents.get(this.props.element); // optimize
        if('container' == ElementComponent.type) {
            let elementsList = this.props.data.map(function( element ){
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data} key={element.getAttribute('id')}/>;
            });
            return elementsList;
        }
        return this.props.content || '';
    },
    getControls: function() {
        var ElementComponent = ElementComponents.get(this.props.element);
        var addControl = 'container' == ElementComponent.type  ? <a onClick={this.addChild} className="glyphicon glyphicon-plus"></a> : null;
        return (<span className="controls" key={['vc-element-controls-' + this.props.element.getAttribute('id')]}>
            {addControl}
            <a onClick={this.editElement} className="glyphicon glyphicon-pencil"></a>
            <a onClick={this.removeElement} className="glyphicon glyphicon-remove"></a>
            <a onClick={this.cloneElement} className="glyphicon glyphicon-duplicate"></a>
        </span>);
    },
    render: function() {
        var element = this.props.element;
        var ElementView = ElementComponents.getElement(element);
        return React.createElement(ElementView, {key: element.getAttribute('id'), content: this.getContent(), controls: this.getControls(), 'data-vc-element': element.getAttribute('id')});
    }
});
Mediator.installTo(Element);
module.exports = Element;