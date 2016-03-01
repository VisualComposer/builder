var vcCake = require('vc-cake');
var React = require('react');
var ElementComponents = vcCake.getService('element').components;
var ReactDOM = require('react-dom');
var MediumEditor = require('medium-editor');
var DndElement = require('./dnd-element');
require('medium-editor/dist/css/medium-editor.css');

require('../css/medium-editor.less');
require('../css/element.less');

var InlineEditorMixin = {
  componentDidMount: function() {
    var component = ReactDOM.findDOMNode(this);
    var element = this.props.element;
    var ElementComponent = ElementComponents.get(element);
    if ('container' != ElementComponent.type) {
      var inlineEditor = new MediumEditor(component, {
        elementsContainer: document.querySelector('.vc_ui-inline-editor-container'),
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'h2', 'url'],
          static: true
        }
      });
      inlineEditor.subscribe('focus', function(event, editable) {
        // Do some workx
        if (editable) {
          // element.childNodes = editable.childNodes;
          // Mediator.getService('data').mutate(element);
        }
      });
    }

  }
};

var Element = React.createClass({
  // mixins: [InlineEditorMixin],
  getContent: function(content) {
    var document = vcCake.getService('document');
    var ElementComponent = ElementComponents.get(this.props.element); // optimize
    if ('container' == ElementComponent.type) {
      let elementsList = this.props.data.map(function(element) {
        let data = document.children(element.id);
        return <Element element={element} data={data} key={element.id}/>;
      });
      return elementsList;
    }
    return content;
  },
  getElementAttributes: function() {
    let element = this.props.element;
    let ElementComponent = ElementComponents.get(element);
    var atts = {};
    Object.keys(ElementComponent).map(function(key) {
      let option = ElementComponent[key];
      let value = vcCake.getService('element').attributes.getElementValue(key, option, element);
      if ('undefined' !== typeof(value) && null !== value) {
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
      key: element.id,
      editor: {
        'data-vc-element': element.id,
        'data-vc-element-type': ElementComponent.type.toString(),
        'data-vc-mutable-element': ElementComponent.mutable ? ElementComponent.mutable.toString() : '',
        'data-vc-editable': 'true',
        'data-vc-name': ElementComponent.name.toString(),
      },
      ...elementAttributes,
      content: this.getContent(elementAttributes.content)
    });
  }
});
module.exports = Element;