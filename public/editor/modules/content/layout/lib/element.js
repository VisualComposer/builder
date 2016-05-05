var vcCake = require('vc-cake');
var React = require('react');
var cook = vcCake.getService('cook');
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
    var ElementComponent = cook.get(this.props.element); // optimize
    if ('container' == ElementComponent.get('type')) {
      let elementsList = documentData.children(this.props.element.id).map(function(element) {
        return <Element element={element} key={element.id} api={this.props.api}/>;
      }, this);
      return elementsList;
    }
    return content;
  },
  render: function() {
    let element = ElementComponents.get(this.props.element);
    let ElementView = ElementComponents.getElement(element);
    let attributes = ElementComponent.toJS();
    return React.createElement(ElementView, {
      ...attributes,
      content: this.getContent(attributes.content)
    });
  }
});
module.exports = Element;