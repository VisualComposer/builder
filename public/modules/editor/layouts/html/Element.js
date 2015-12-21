var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var ElementsHelper = require('../../../../helpers/Elements');
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
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    editElement: function() {
      Element.publish('app:edit', this.props.element);
    },
    getContent: function() {
        let elementsList = this.props.data.map(function( element ){
            let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={{tag: element.tagName, id: element.getAttribute('id')}} data={data} key={element.getAttribute('id')}/>;
        });
        return elementsList;
    },
    getControls: function() {
        var addControl = 'Section' === this.props.element.tag ? (<a onClick={this.addChild} className="glyphicon glyphicon-plus"></a>) : null;
        return <span className="controls">
            {addControl}
            <a onClick={this.editElement} className="glyphicon glyphicon-pencil"></a>
        </span>;
    },
    render: function() {
        var element = this.props.element;
        var Element = ElementsHelper.getElement(element);
        return React.createElement(Element, {key: Utils.createKey(), content: this.getContent(), controls: this.getControls(), 'data-vc-element': element.id});
    }
});
Mediator.installTo(Element);
module.exports = Element;