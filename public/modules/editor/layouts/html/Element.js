var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var ElementsHelper = require('../../../../helpers/Elements');
//var Sortable = require('react-rubaxa-sortable/node_modules/sortablejs/Sortable.js');
var ReactDOM = require('react-dom');
require('./Element.less');

// run: \vc-five\node_modules\react-rubaxa-sortable\node_modules\sortablejs>npm install && grunt jquery
var SortableMixin = {
	componentDidMount: function () {
		var component = ReactDOM.findDOMNode( this );
		if ( $( component ).is( '[data-vc-element="vc-v-root-element"' ) ) {
			var elements = component.querySelectorAll( '[data-vc-element]' );
			$.each( elements, function ( key, item ) {
				$( item ).sortable( {
					animation: 150,
					forceFallback: true,
					onUpdate: function ( ev ) {
						var $el = $( ev.item );
						Element.publish( 'data:move',
							$el.data( 'vcElement' ),
							$el.next( '[data-vc-element]' ).data( 'vcElement' ) );
					}
				} );
			} );
		}
	}
};

var Element = React.createClass({
	mixins: [SortableMixin],
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
        return React.createElement(Element, {key: Utils.createKey(), content: this.getContent(), 'data-vc-element': element.id});
    }
});
Mediator.installTo(Element);
module.exports = Element;