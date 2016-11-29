import React from 'react'
import ReactDOM from 'react-dom'
import MediumEditor from 'medium-editor'
import vcCake from 'vc-cake'
import $ from 'jquery'

const documentManager = vcCake.getService('document')
const cook = vcCake.getService('cook')
const dataProcessor = vcCake.getService('dataProcessor')
export default class ContentEditableComponent extends React.Component {
  static spinnerHTML = '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'

  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired,
    children: React.PropTypes.string,
    className: React.PropTypes.string
  }

  constructor (props) {
    super(props)
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document
    this.state = {
      contentEditable: false,
      trackMouse: false,
      html: ContentEditableComponent.spinnerHTML,
      realContent: this.props.children,
      mouse: null,
      overlayTimeout: null
    }
    this.handleLayoutModeChange = this.handleLayoutModeChange.bind(this)
    this.handleGlobalClick = this.handleGlobalClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.contentEditable !== true && nextProps.children !== this.state.realContent) {
      this.setState({ realContent: nextProps.children })
      this.updateHtmlWithServer(nextProps.children)
    }
  }

  handleLayoutModeChange (mode) {
    mode !== 'dnd' && this.setState({ contentEditable: mode === 'contentEditable', trackMouse: false })
    if (mode !== 'contentEditable') {
      this.iframeWindow.removeEventListener('click', this.handleGlobalClick)
      this.medium.destroy()
      this.removeOverlay()
    }
    // add overlay
    if (this.state.contentEditable) {
      this.drawOverlay()
    }
  }

  drawOverlay () {
    console.log('draw iframeOverlay')
    let elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
    if (!elementOverlay) {
      elementOverlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'svg')
      elementOverlay.id = 'vcv-ui-content-overlay'
      elementOverlay.classList.add('vcv-ui-content-overlay-container')
      // todo: remove styles from js
      let styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1900
      }
      for (let prop in styles) {
        elementOverlay.style[ prop ] = styles[ prop ]
      }
      this.iframeDocument.body.appendChild(elementOverlay)
    }

    let overlay = this.iframeDocument.querySelector('.vcv-ui-content-overlay')
    if (!overlay) {
      overlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'path')
      overlay.classList.add('vcv-ui-content-overlay')
      overlay.setAttribute('fill', 'rgba(0, 0, 0, .3)')
      overlay.setAttribute('fill-rule', 'evenodd')
      // todo: remove styles from js
      let styles = {
        pointerEvents: 'all',
        stroke: 'rgba(183, 183, 183, .8)',
        strokeWidth: 1,
        strokeLinejoin: 'miter',
        strokeLinecap: 'butt',
        strokeMiterlimit: 3,
        strokeDasharray: 3,
        strokeDashoffset: 1
      }
      for (let prop in styles) {
        overlay.style[ prop ] = styles[ prop ]
      }
      elementOverlay.appendChild(overlay)
    }

    let data = {
      domElement: ReactDOM.findDOMNode(this),
      overlayContainer: elementOverlay,
      overlay: overlay
    }
    this.autoUpdateOverlayPosition(data)
  }

  removeOverlay () {
    console.log('remove iframeOverlay')
    this.stopAutoUpdateOverlayPosition()
    while (this.iframeDocument.body && this.iframeDocument.body.querySelector('#vcv-ui-content-overlay')) {
      this.iframeDocument.body.removeChild(this.iframeDocument.body.querySelector('#vcv-ui-content-overlay'))
    }
  }

  updateOverlayPosition (data) {
    // console.log(data)
    let paddingSize = 5
    let domElement = data.domElement
    let overlayContainer = data.overlayContainer
    let overlay = data.overlay
    let bodyPos = this.iframeDocument.body.getBoundingClientRect()

    // set main svg width and height
    overlayContainer.style.width = bodyPos.width
    overlayContainer.style.height = bodyPos.height

    // draw overlay for svg
    let containerSize = `M 0 0 H ${bodyPos.width} V ${bodyPos.height} H 0 V 0`
    let elementPos = domElement.getBoundingClientRect()
    let elPos = {
      x: Math.floor(elementPos.left - bodyPos.left - paddingSize),
      y: Math.floor(elementPos.top - bodyPos.top - paddingSize),
      w: Math.ceil(elementPos.width + paddingSize * 2),
      h: Math.ceil(elementPos.height + paddingSize * 2)
    }
    let elementSize = `M ${elPos.x} ${elPos.y} h ${elPos.w} v ${elPos.h} h -${elPos.w} z`
    overlay.setAttribute('d', `${containerSize} ${elementSize}`)
  }

  /**
   * Automatically update controls container position after timeout
   * @param element
   */
  autoUpdateOverlayPosition (data) {
    this.stopAutoUpdateOverlayPosition()
    if (!this.state.overlayTimeout) {
      this.updateOverlayPosition(data)
      this.setState({
        overlayTimeout: this.iframeWindow.setInterval(this.updateOverlayPosition.bind(this, data), 16)
      })
    }
  }

  /**
   * Stop automatically update controls container position and clear timeout
   */
  stopAutoUpdateOverlayPosition () {
    if (this.state.overlayTimeout) {
      this.iframeWindow.clearInterval(this.state.overlayTimeout)
      this.setState({
        overlayTimeout: null
      })
    }
  }

  getShortcodesRegexp () {
    return RegExp('\\[(\\[?)(\\w+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  }

  mediumSetup () {
    this.medium.setup()
    this.medium.subscribe('editableInput', () => {
      this.updateElementData()
      if (this.mediumSelection) {
        this.medium.importSelection(this.mediumSelection)
        this.mediumSelection = undefined
      }
    })
    this.mediumSelection = this.medium.exportSelection()
  }

  componentDidMount () {
    const dom = ReactDOM.findDOMNode(this)
    this.medium = new MediumEditor(dom, {
      delay: 1000,
      toolbar: { buttons: [ 'bold', 'italic', 'underline' ] },
      paste: {
        cleanPastedHTML: true,
        cleanAttrs: [ 'style', 'dir' ],
        cleanTags: [ 'label', 'meta' ],
        unwrapTags: [ 'sub', 'sup' ]
      },
      contentWindow: this.iframeWindow,
      ownerDocument: this.iframeDocument,
      elementsContainer: this.iframeDocument.body
    })
    this.medium.destroy()
    vcCake.onDataChange('vcv:layoutCustomMode', this.handleLayoutModeChange)
    this.updateHtmlWithServer(this.props.children)
  }

  updateHtmlWithServer (content) {
    if (content.match(this.getShortcodesRegexp())) {
      this.setState({ html: ContentEditableComponent.spinnerHTML })
      dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxShortcodeRender:adminNonce',
        'vcv-shortcode-string': content,
        'vcv-nonce': window.vcvNonce
      }).then((data) => {
        this.setState({ html: data })
      })
    } else {
      this.setState({ html: content })
    }
  }

  componentWillUnmount () {
    vcCake.ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutModeChange)
  }

  updateElementData () {
    const dom = ReactDOM.findDOMNode(this)
    const data = documentManager.get(this.props.id)
    const element = cook.get(data)
    let content = dom.innerHTML
    element.set(this.props.field, dom.innerHTML)
    this.setState({ realContent: content })
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
      this.updateHtmlWithServer(this.state.realContent)
    }
  }

  handleMouseMove () {
    if (this.state.trackMouse === true) {
      this.setState({ trackMouse: false, contentEditable: false })
      this.medium.destroy()
    }
  }

  handleMouseDown () {
    if (this.state.trackMouse === false && this.state.contentEditable === false) {
      this.setState({ trackMouse: true, contentEditable: true })
    }
  }

  handleMouseUp () {
    if (this.state.trackMouse === true) {
      this.mediumSetup()
      if (vcCake.getData('vcv:layoutCustomMode') !== 'contentEditable') {
        vcCake.setData('vcv:layoutCustomMode', 'contentEditable')
      }
      this.iframeWindow.addEventListener('click', this.handleGlobalClick)
      this.setState({ html: this.state.realContent })
    }
  }

  render () {
    const props = {
      dangerouslySetInnerHTML: { __html: this.state.html },
      className: this.props.className,
      contentEditable: this.state.contentEditable,
      onMouseDown: this.handleMouseDown.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseUp: this.handleMouseUp.bind(this),
      'data-vcvs-html': this.state.realContent
    }
    if (this.mediumSelection) {
      window.setTimeout(() => {
        this.medium && this.medium.importSelection(this.mediumSelection)
        this.mediumSelection = undefined
      }, 0)
    }
    return React.createElement('vcvhelper', props)
  }
}
