var vcCake = require('vc-cake');
var React = require('react');
var ElementComponents = vcCake.getService('element').components;

var Element = React.createClass({
  getContent: function(content) {
    var ElementComponent = ElementComponents.get(this.props.element); // optimize
    let document = vcCake.getService('document');
    if ('container' == ElementComponent.type) {
      return this.props.data.map(function(element) {
        let data = document.children(element.id);
        return <Element element={element} data={data} key={element.id} api={this.props.api}/>;
      }, this);
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
    var ElementView = ElementComponents.getElement(element);
    var elementAttributes = this.getElementAttributes();
    return React.createElement(ElementView, {
      ...elementAttributes,
      content: this.getContent(elementAttributes.content),
    });
  }
});
module.exports = Element;