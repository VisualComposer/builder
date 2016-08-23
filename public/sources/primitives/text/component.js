import React from 'react'
import ReactDOM from 'react-dom'
import MediumEditor from 'medium-editor'
import vcCake from 'vc-cake'

const documentManager = vcCake.getService('document')
const cook = vcCake.getService('cook')
require('medium-editor/dist/css/medium-editor.css')
require('medium-editor/dist/css/themes/default.css')

export default class Text extends React.Component {
  static propTypes = {
    tag: React.PropTypes.string.isRequired,
    inlineEditable: React.PropTypes.object,
    children: React.PropTypes.string,
    class: React.PropTypes.string
  }
  componentDidMount () {
    if (this.props.inlineEditable && this.props.inlineEditable.field && this.props.inlineEditable.id) {
      return
      const dom = ReactDOM.findDOMNode(this)
      const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
      this.medium = new MediumEditor(dom, {
        delay: 1000,
        toolbar: {buttons: ['bold', 'italic', 'underline']},
        paste: {
          cleanPastedHTML: true,
          cleanAttrs: ['style', 'dir'],
          cleanTags: ['label', 'meta'],
          unwrapTags: ['sub', 'sup']
        },
        contentWindow: contentWindow,
        ownerDocument: contentWindow.document,
        elementsContainer: contentWindow.document.body
      })
      this.medium.subscribe('editableInput', (event, editable) => {
        const data = documentManager.get(this.props.inlineEditable.id)
        const element = cook.get(data)
        element.set(this.props.inlineEditable.field, editable.innerHTML)
        documentManager.update(this.props.inlineEditable.id, element.toJS())
      })
    }
  }
  render () {
    const tag = this.props.tag
    const props = {
      dangerouslySetInnerHTML: { __html: this.props.children },
      className: this.props.class || null
    }
    return React.createElement(tag, props)
  }
}
