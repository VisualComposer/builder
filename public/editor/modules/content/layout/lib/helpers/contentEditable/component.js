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
      contentEditable: false,
      trackMouse: false
    }
    this.handleDndState = this.handleDndState.bind(this)
    this.handleLayoutModeChange = this.handleLayoutModeChange.bind(this)
    this.handleGlobalClick = this.handleGlobalClick.bind(this)
  }
  handleDndState (dndState) {
    this.setState({contentEditable: !dndState})
  }
  handleLayoutModeChange (mode) {
    const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
    mode !== 'dnd' && this.setState({contentEditable: mode === 'contentEditable', trackMouse: false})
    if (mode !== 'contentEditable') {
      contentWindow.removeEventListener('click', this.handleGlobalClick)
      this.medium.destroy()
    }
  }
  mediumSetup () {
    this.medium.setup()
    this.medium.subscribe('editableInput', () => {
      this.updateElementData()
    })
  }
  componentDidMount () {
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
    this.medium.destroy()
    vcCake.onDataChange('vcv:layoutCustomMode', this.handleLayoutModeChange)
  }
  componentWillUnmount () {
    vcCake.ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutModeChange)
  }
  updateElementData () {
    const dom = ReactDOM.findDOMNode(this)
    const data = documentManager.get(this.props.id)
    const element = cook.get(data)
    element.set(this.props.field, dom.innerHTML)
    documentManager.update(this.props.id, element.toJS())
  }
  handleChange () {
    this.updateElementData()
  }
  handleGlobalClick (e) {
    const $target = $(e.target)
    if (!$target.is('[data-vcv-element="' + this.props.id + '"]') && !$target.parents('[data-vcv-element="' + this.props.id + '"]').length) {
      this.medium.destroy()
      if (vcCake.getData('vcv:layoutCustomMode') !== null) {
        vcCake.setData('vcv:layoutCustomMode', null)
      }
    }
  }
  handleMouseMove () {
    if (this.state.trackMouse === true) {
      this.setState({trackMouse: false, contentEditable: false})
      this.medium.destroy()
    }
  }
  handleMouseDown () {
    if (this.state.trackMouse === false && this.state.contentEditable === false) {
      this.setState({trackMouse: true, contentEditable: true})
    }
  }
  handleMouseUp () {
    if (this.state.trackMouse === true) {
      this.mediumSetup()
      if (vcCake.getData('vcv:layoutCustomMode') !== 'contentEditable') {
        vcCake.setData('vcv:layoutCustomMode', 'contentEditable')
      }
      const contentWindow = document.getElementById('vcv-editor-iframe').contentWindow
      contentWindow.addEventListener('click', this.handleGlobalClick)
    }
  }
  render () {
    const props = {
      dangerouslySetInnerHTML: { __html: this.props.children },
      className: this.props.className,
      contentEditable: this.state.contentEditable,
      onMouseDown: this.handleMouseDown.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseUp: this.handleMouseUp.bind(this)
    }
    return React.createElement('div', props)
  }
}
