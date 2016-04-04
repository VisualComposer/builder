var MediumEditor = require('medium-editor');
require('medium-editor/dist/css/medium-editor.css');

require('../css/medium-editor.less');
module.exports = {
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