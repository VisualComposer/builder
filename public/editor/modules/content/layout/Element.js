var React = require('react');
var Utils = require('../../.././Utils');
var Mediator = require('../../.././Mediator');
var ElementComponents = require('../../.././ElementComponents');
var ReactDOM = require('react-dom');
var MediumEditor = require('medium-editor');
require('medium-editor/dist/css/medium-editor.css');

require('./MediumEditor.less');
require('./Element.less');

var DndElement = require('./DndElement.js');

var InlineEditorMixin = {
    componentDidMount: function () {
        var component = ReactDOM.findDOMNode( this );
        var element = this.props.element;
        var ElementComponent = ElementComponents.get(element);
        if('container' != ElementComponent.type) {
            var inlineEditor = new MediumEditor(component, {
                elementsContainer: document.querySelector('.vc_ui-inline-editor-container'),
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'h2', 'url'],
                    static: true
                }
            });
            inlineEditor.subscribe('focus', function (event, editable) {
                // Do some workx
                if(editable) {
                    // element.childNodes = editable.childNodes;
                    // Mediator.getService('data').mutate(element);
                }
            });
        }

    }
};

var Element = React.createClass(Mediator.installTo({
    // mixins: [InlineEditorMixin],
    getContent: function(content) {
        var ElementComponent = ElementComponents.get(this.props.element); // optimize
        if('container' == ElementComponent.type) {
            let elementsList = this.props.data.map(function( element ){
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data} key={element.getAttribute('id')}/>;
            });
            return elementsList;
        }
        return content;
    },
    getElementAttributes: function() {
        let element = this.props.element;
        let ElementComponent = ElementComponents.get(element);
        var atts = {};
        Object.keys(ElementComponent).map(function(key){
            let value = null;
            let option = ElementComponent[key];
            value = Mediator.getService('attributes').getElementValue(key, option, element);
            if( 'undefined' !== typeof(value) && null !== value ) {
                atts[key] = value;
            }
        }, this);
        return atts;
    },
    render: function() {
        var element = this.props.element;
        var ElementComponent = ElementComponents.get(element);
        var ElementView = ElementComponents.getElement(element);
        var elementAttributes = this.getElementAttributes();

        return React.createElement(DndElement, {
			'ElementView': ElementView,
            key: element.getAttribute('id'),
            editor: {
				'data-vc-element': element.getAttribute( 'id' ),
				'data-vc-element-type': ElementComponent.type.toString(),
				'data-vc-mutable-element': ElementComponent.mutable ? ElementComponent.mutable.toString() : '',
				'data-vc-editable': 'true',
				'data-vc-name': ElementComponent.name.toString(),
			},
            ...elementAttributes,
            content: this.getContent(elementAttributes.content)
        });
    }
}));
module.exports = Element;