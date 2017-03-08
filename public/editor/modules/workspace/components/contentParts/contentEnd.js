import React from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import {getStorage} from 'vc-cake'
import Resizer from '../../../../../resources/resizer/resizer'

const workspaceContentEndState = getStorage('workspace').state('contentEnd')

export default class ContentEnd extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }
  constructor (props) {
    super(props)
    this.state = {
      contentComponent: null,
      contentProps: {},
      showContent: false,
      realWidth: 0
    }

    this.handleElementResize = this.handleElementResize.bind(this)
    this.closeContent = this.closeContent.bind(this)
    this.showContent = this.showContent.bind(this)
    this.hideContent = this.hideContent.bind(this)
  }

  componentDidMount () {
    this.addResizeListener(ReactDOM.findDOMNode(this), this.handleElementResize)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this), this.handleElementResize)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.showContent && !prevState.showContent) {
      setTimeout(this.handleElementResize, 20) // TODO: fix this on global refactor
    }
  }

  showContent () {
    this.setState({ showContent: true })
  }

  hideContent () {
    this.setState({
      showContent: false,
      contentComponent: null,
      contentProps: {}
    })
  }

  handleElementResize () {
    let element = ReactDOM.findDOMNode(this)
    this.setState({
      realWidth: element.offsetWidth
    })
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  closeContent (e) {
    e && e.preventDefault()
    workspaceContentEndState.set(false)
  }

  render () {
    let aligned = false
    const {children} = this.props
    /*
     if (contentProps && contentProps.api && (contentProps.api.name === 'uiAddElement' || contentProps.api.name === 'uiAddTemplate')) {
      aligned = true
    }
    */
    let contentClasses = classNames({
      'vcv-layout-bar-content-end': true,
      'vcv-ui-state--visible': !!children,
      'vcv-media--xs': true,
      'vcv-media--sm': this.state.realWidth > 400,
      'vcv-media--md': this.state.realWidth > 800,
      'vcv-media--lg': this.state.realWidth > 1200,
      'vcv-media--xl': this.state.realWidth > 1600
    })
    let closeBtnClasses = classNames({
      'vcv-layout-bar-content-hide': true,
      'vcv-layout-bar-content-aligned': aligned
    })

    return (
      <div className={contentClasses} id='vcv-editor-end'>
        <a className={closeBtnClasses} href='#' title='Close'
          onClick={this.closeContent}>
          <i className='vcv-layout-bar-content-hide-icon vcv-ui-icon vcv-ui-icon-close-thin' />
        </a>
        {children}
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-top vcv-ui-resizer-content-end-bottom'
        }} />

        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-left vcv-ui-resizer-content-end-right'
        }} />

        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-right vcv-ui-resizer-content-end-left'
        }} />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-bottom vcv-ui-resizer-content-end-top'
        }} />
      </div>
    )
  }
}
