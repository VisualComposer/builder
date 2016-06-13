var vcCake = require('vc-cake')
var React = require('react')
var ReactDOM = require('react-dom')
var cook = vcCake.getService('cook')
require('../css/element.less')

var Element = React.createClass({
  propTypes: {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    this.props.api.notify('element:mount', this.props.element.id)
    this.tinyMce()
  },
  tinyMce: function () {
    var innerTinymce = window.jQuery('#vcv-editor-iframe').get(0).contentWindow.tinymce
    if (ReactDOM.findDOMNode(this).querySelector('.editable')) {
      innerTinymce.init({
        target: ReactDOM.findDOMNode(this).querySelector('.editable'),
        inline: true,
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify',
        setup: function (editor) {
          editor.on('change', function (e) {
            let element = cook.get(this.props.element)
            element.set('output', editor.getContent())
            this.props.api.request('data:update', element.get('id'), element.toJS(true))
          }.bind(this))
        }.bind(this),
        menubar: false
      })
    }
  },
  componentWillUnmount: function () {
    this.props.api.notify('element:unmount', this.props.element.id)
  },
  getContent: function (content) {
    var documentData = vcCake.getService('document')
    var currentElement = cook.get(this.props.element) // optimize
    if (currentElement.get('type') === 'container') {
      let elementsList = documentData.children(currentElement.get('id')).map(function (childElement) {
        return <Element element={childElement} key={childElement.id} api={this.props.api} />
      }, this)
      return elementsList
    }
    return content
  },
  render: function () {
    let element = cook.get(this.props.element)
    return element.render(this.getContent())
  }
})
module.exports = Element
