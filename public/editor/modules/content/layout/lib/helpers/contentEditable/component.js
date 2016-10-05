import React from 'react'
import ReactDOM from 'react-dom'
import MediumEditor from 'medium-editor'
import vcCake from 'vc-cake'
import $ from 'jquery'

const documentManager = vcCake.getService('document')
const cook = vcCake.getService('cook')

export default class ContentEditable extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired,
    children: React.PropTypes.string,
    className: React.PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      contentEditable: true,
      editionStarted: false
    }
    this.handleDndState = this.handleDndState.bind(this)
  }
  handleDndState (dndState) {
    this.setState({contentEditable: !dndState})
  }
  componentDidMount () {
    if (this.state.contentEditable) {
      this.editorActivated = false
      const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
      const dom = ReactDOM.findDOMNode(this)
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
    }
    vcCake.onDataChange('vcvDnDStarted', this.handleDndState)
  }
  componentWillUnmount () {
    vcCake.ignoreDataChange('vcvDnDStarted', this.handleDndState)
  }
  handleChange (e) {
    const data = documentManager.get(this.props.id)
    const element = cook.get(data)
    element.set(this.props.field, e.currentTarget.innerHTML)
    documentManager.update(this.props.id, element.toJS())
  }
  handleMouseDown () {
    const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
    const dom = ReactDOM.findDOMNode(this)
    let $dom = $(dom)
    if (this.editorActivated === false) {
      let domMouseUpFired = false
      $dom.one('mouseup', () => {
        domMouseUpFired = true
        if (this.editorActivated === false) {
          vcCake.setData('textInlineEditableStared', true)
        }
        this.editorActivated = true
        this.medium.setup()
        this.setState({contentEditable: true})
      }).one('mousemove', () => {
        if (this.editorActivated === false) {
          this.medium.destroy()
          this.setState({contentEditable: false})
        }
      })
      // Set global listener to enable
      $(contentWindow).one('mouseup', () => {
        if (domMouseUpFired === false) {
          this.editorActivated = false
          vcCake.setData('textInlineEditableStared', false)
        }
      })
    }
  }
  handleBlur () {
    if (this.editorActivated === false) {
      this.setState({ contentEditable: true })
    }
    this.editorActivated = false
    vcCake.setData('textInlineEditableStared', false)
  }
  render () {
    const props = {
      dangerouslySetInnerHTML: { __html: this.props.children },
      className: this.props.className,
      contentEditable: this.state.contentEditable,
      onKeyUp: this.state.contentEditable ? this.handleChange.bind(this) : null,
      onMouseDown: this.state.contentEditable ? this.handleMouseDown.bind(this) : null,
      onBlur: this.state.contentEditable ? this.handleBlur.bind(this) : null
    }
    return React.createElement('div', props)
  }
}
