import React from 'react'
import ReactDOM from 'react-dom'
// import MediumEditor from 'medium-editor'
import vcCake from 'vc-cake'
import $ from 'jquery'

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
  constructor (props) {
    super(props)
    this.state = {
      contentEditable: !!(this.props.inlineEditable && this.props.inlineEditable.field && this.props.inlineEditable.id),
      editionStarted: false
    }
  }
  componentDidMount () {
    if (this.state.contentEditable) {
      this.editorActivated = false
/*      dom.addEventListener('mousedown', () => {

      })*/
      /* const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
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
      }) */
/*      let start = 0
      let startActivation = false
      let disableSelectStart = (e) => {
        e.preventDefault()
      }
      let point = {}
      dom.setAttribute('contenteditable', true)
      dom.addEventListener('mousedown', (e) => {
        start = new Date().getTime()
        point = {x: e.clientX, y: e.clientY}
        $(dom).one('mousemove', (e) => {
          console.log('mousemove')
          e.currentTarget.addEventListener('selectstart', disableSelectStart)
      })
      })
      dom.addEventListener('focus', (e) => {

      })
      dom.addEventListener('mouseup', (e) => {
        e.currentTarget.removeEventListener('selectstart', disableSelectStart)
      })*/

      /* dom.addEventListener('mouseup', (e) => {
        dom.setAttribute('contenteditable', false)
      })
      this.medium.subscribe('editableInput', (event, editable) => {
        const data = documentManager.get(this.props.inlineEditable.id)
        const element = cook.get(data)
        element.set(this.props.inlineEditable.field, editable.innerHTML)
        documentManager.update(this.props.inlineEditable.id, element.toJS())
      }) */
    }
  }
  handleChange (e) {
    const data = documentManager.get(this.props.inlineEditable.id)
    const element = cook.get(data)
    element.set(this.props.inlineEditable.field, e.currentTarget.innerHTML)
    documentManager.update(this.props.inlineEditable.id, element.toJS())
  }
  handleMouseDown () {
    const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
    const dom = ReactDOM.findDOMNode(this)
    let $dom = $(dom)
    console.log('mousedown: ' + this.editorActivated)
    if (this.editorActivated === false) {
      let domMouseUpFired = false
      $dom.one('mouseup', () => {
        console.log('dom mouseup:' + this.editorActivated)
        domMouseUpFired = true
        this.editorActivated = true
        this.setState({contentEditable: true})
      }).one('mousemove', () => {
        console.log('mousemove: ' + this.editorActivated)
        if (this.editorActivated === false) {
          console.log('mousemove disable contentEditable')
          this.setState({contentEditable: false})
        }
      })
      // Set global listener to enable
      $(contentWindow).one('mouseup', () => {
        console.log('contentWindow mouseup:' + this.editorActivated + ', ' + domMouseUpFired)
        if (domMouseUpFired === false) {
          this.editorActivated = false
          this.setState({contentEditable: true})
        }
      })
      $dom
    }
  }
  handleBlur () {
    console.log('blur:' + this.editorActivated)
    if (this.editorActivated === false) {
      this.setState({ contentEditable: true })
    }
    this.editorActivated = false
  }
  render () {
    const tag = this.props.tag
    const props = {
      dangerouslySetInnerHTML: { __html: this.props.children },
      className: this.props.class || null,
      contentEditable: this.state.contentEditable,
      onKeyUp: this.state.contentEditable ? this.handleChange.bind(this) : null,
      onMouseDown: this.state.contentEditable ? this.handleMouseDown.bind(this) : null,
      onBlur: this.state.contentEditable ? this.handleBlur.bind(this) : null
    }
    return React.createElement(tag, props)
  }
}
