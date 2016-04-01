var vcCake = require('vc-cake');
var React = require('react');
var ElementComponents = vcCake.getService('element').components;
require('../css/element.less');

var Element = React.createClass({
  componentDidMount: function() {
      this.props.api.notify('element:mount', this.props.element.id);
    },
  componentWillUnmount: function() {
    this.props.api.notify('element:unmount', this.props.element.id);
  },
  getContent: function(content) {
    var documentData = vcCake.getService('document');
    var ElementComponent = ElementComponents.get(this.props.element); // optimize
    if ('container' == ElementComponent.type) {
      let elementsList = documentData.children(this.props.element.id).map(function(element) {
        return <Element element={element} key={element.id} api={this.props.api}/>;
      }, this);
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
    return React.createElement(ElementView, {
      editor: {
        'data-vc-element': element.id,
        'data-vc-element-type': ElementComponent.type.toString(),
        'data-vc-mutable-element': ElementComponent.mutable ? ElementComponent.mutable.toString() : '',
        'data-vc-editable': 'true',
        'data-vc-name': ElementComponent.name.toString()
      },
      ...elementAttributes,
      content: this.getContent(elementAttributes.content)
    });
  }
});
module.exports = Element;