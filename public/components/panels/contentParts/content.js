import React from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import { getService, getStorage } from 'vc-cake'
import Resizer from '../../resizer/resizer'
import PropTypes from 'prop-types'
const dataManager = getService('dataManager')
const workspaceSettings = getStorage('workspace').state('settings')

export default class Content extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]).isRequired
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
    this.handleClickCloseContent = this.handleClickCloseContent.bind(this)
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
    const element = ReactDOM.findDOMNode(this)
    this.setState({
      realWidth: element.offsetWidth
    })
  }

  addResizeListener (element, fn) {
    const isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    const obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function () {
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

  handleClickCloseContent (e) {
    e && e.preventDefault()
    workspaceSettings.set(false)
  }

  render () {
    const localizations = dataManager.get('localizations')
    let closeTitle = localizations ? localizations.close : 'Close'
    closeTitle = closeTitle + ' (Esc)'

    let aligned = false
    const { children, content } = this.props

    if (content && (content === 'addElement' || content === 'addTemplate' || content === 'addHubElement')) {
      aligned = true
    }

    const currentSettings = workspaceSettings.get()

    const contentClasses = classNames({
      'vcv-layout-bar-content-all': true,
      'vcv-ui-state--visible': !!children,
      'vcv-media--xs': true,
      'vcv-media--sm': this.state.realWidth > 400,
      'vcv-media--md': this.state.realWidth > 800,
      'vcv-media--lg': this.state.realWidth > 1200,
      'vcv-media--xl': this.state.realWidth > 1600,
      'vcv-ui-hide-resizers': currentSettings && currentSettings.action && (currentSettings.action === 'addHub')
    })

    const closeBtnClasses = classNames({
      'vcv-layout-bar-content-hide': true,
      'vcv-layout-bar-content-aligned': aligned
    })

    let closeButton = null
    if (content === 'addHubElement' || content === 'insights' || content === 'settings') {
      closeButton = (
        <span className={closeBtnClasses} title={closeTitle} onClick={this.handleClickCloseContent}>
          <i className='vcv-layout-bar-content-hide-icon vcv-ui-icon vcv-ui-icon-close-thin' />
        </span>
      )
    }

    return (
      <div className={contentClasses} id='vcv-editor-end'>
        {closeButton}
        {children}
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-top vcv-ui-resizer-content-all-bottom'
        }}
        />

        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-left vcv-ui-resizer-content-all-right'
        }}
        />

        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-right vcv-ui-resizer-content-all-left'
        }}
        />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-bottom vcv-ui-resizer-content-all-top'
        }}
        />
      </div>
    )
  }
}
