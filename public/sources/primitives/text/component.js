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
      const dom = ReactDOM.findDOMNode(this)
/*      dom.setAttribute('contenteditable', true)
      let started = false
      dom.addEventListener('mousedown', () => {
        console.log('mousedown: ' + started)
        if (started === false) {
          let disableSelectStart = (e) => {
            console.log('disable select start')
            e.preventDefault()
          }
          $(dom).one('mousemove', () => {
            console.log('mousemove: ' + started)
            if (started === false) {
              dom.setAttribute('contenteditable', false)
              dom.addEventListener('selectstart', disableSelectStart)
            }
          })
          $(dom).one('mouseup', () => {
            console.log('mouseup')
            if (getData('vcv-dnd-started') !== true) {
              started = true
            }
          })
          const exitCallback = (e) => {
            if (e.target !== dom) {
              dom.setAttribute('contenteditable', true)
              dom.removeEventListener('selectstart', disableSelectStart)
              started = false
              $(dom).off('click', exitCallback)
            }
          }
          $(dom).parents('body').on('click', exitCallback)
        }
      })*/
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
      })*/
      this.medium.subscribe('editableInput', (event, editable) => {
        const data = documentManager.get(this.props.inlineEditable.id)
        const element = cook.get(data)
        element.set(this.props.inlineEditable.field, editable.innerHTML)
        documentManager.update(this.props.inlineEditable.id, element.toJS())
      })

    }
  }
/*  shouldComponentUpdate () {
    return false
  }*/
  componentWillUnmount () {
    const dom = ReactDOM.findDOMNode(this)
    this.medium.removeElements(dom)
  }
  setupEditor (e) {
    /* let start = new Date().getTime()
    setData('vcv-dnd-disabled', true)
    $(e.currentTarget).one('mousemove', (e) => {
      let end = new Date().getTime()
      console.log(end - start)
      // const dom = ReactDOM.findDOMNode(this)
      // dom.setAttribute('contenteditable', false)
    })*/
  }
  render () {
    const tag = this.props.tag
    const props = {
      dangerouslySetInnerHTML: { __html: this.props.children },
      className: this.props.class || null
      // onMouseUp: this.props.inlineEditable ? this.setupEditor : null
    }
    return React.createElement(tag, props)
  }
}
