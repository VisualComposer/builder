import React from 'react'
import BarContent from './content'
import BarHeader from './header'
import Resizer from '../../../../../resources/resizer/resizer'
import ClassNames from 'classnames'

export default class LayoutBar extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired
  }

  layoutWidth = this.props.layout.getBoundingClientRect().width
  layoutBar = null

  constructor (props) {
    super(props)
    this.state = {
      hasStartContent: false,
      hasEndContent: false,
      isSticky: false,
      barLeftPos: null,
      barTopPos: null,
      barWidth: null,
      adminBar: document.getElementById('wpadminbar')
    }
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleStickyLayoutBarResize = this.handleStickyLayoutBarResize.bind(this)
  }

  componentDidMount () {
    this.props.api
      .reply('bar-content-start:show', () => {
        this.setState({
          hasStartContent: true
        })
      })
      .reply('bar-content-start:hide', () => {
        this.setState({
          hasStartContent: false
        })
      })
      .reply('bar-content-end:show', () => {
        this.setState({
          hasEndContent: true
        })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({
          hasEndContent: false
        })
      })
    window.addEventListener('scroll', this.handleWindowScroll)
    this.addResizeListener(this.props.layout, this.handleStickyLayoutBarResize)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleWindowScroll)
    this.removeResizeListener(this.props.layout, this.handleStickyLayoutBarResize)
  }

  resizeCallback = (e) => {
    if (e && e.direction) {
      if (e.direction === 'top') {
        this.props.api.request('navbar:resizeTop', e.offsetY)
      } else if (e.direction === 'left') {
        this.props.api.request('navbar:resizeLeft', e.offsetX)
      }
    }
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

  handleStickyLayoutBarResize () {
    let currentHeaderWidth = this.props.layout.getBoundingClientRect().width
    if (this.state.isSticky && this.layoutWidth !== currentHeaderWidth) {
      this.setState({ isSticky: false })
    }
    this.layoutWidth = currentHeaderWidth
  }

  handleWindowScroll () {
    let { isSticky, adminBar } = this.state
    let layoutPos = this.props.layout.getBoundingClientRect()
    let bar = this.layoutBar.getBoundingClientRect()
    let adminBarPos = window.getComputedStyle(adminBar).position
    let adminBarHeight = adminBarPos === 'absolute' ? 0 : adminBar.getBoundingClientRect().height
    if (layoutPos.bottom < adminBarHeight + bar.height && layoutPos.top < adminBarHeight + bar.height) {
      this.setState({
        isSticky: false
      })
      return
    }
    if (layoutPos.top < adminBarHeight && !isSticky) {
      this.setState({
        isSticky: true,
        barLeftPos: layoutPos.left,
        barTopPos: adminBarHeight,
        barWidth: layoutPos.width
      })
      return
    }
    if (layoutPos.top > adminBarHeight + bar.height && isSticky) {
      this.setState({ isSticky: false })
    }
  }

  render () {
    let { hasStartContent, hasEndContent, isSticky, barTopPos, barLeftPos, barWidth } = this.state
    let { api } = this.props
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(hasStartContent || hasEndContent),
      'vcv-ui-content-start--visible': hasStartContent,
      'vcv-ui-content-end--visible': hasEndContent
    })
    let stickyBar = {}
    if (isSticky) {
      stickyBar = {
        position: 'fixed',
        top: `${barTopPos}px`,
        left: `${barLeftPos}px`,
        width: `${barWidth}px`
      }
    }
    return (
      <div className={layoutClasses} style={stickyBar} ref={(bar) => { this.layoutBar = bar }}>
        <BarHeader api={api} />
        <BarContent api={api} />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-bottom',
          callback: this.resizeCallback
        }} />

        <Resizer params={{
          resizeLeft: true,
          resizeTop: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizeBottom: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-bottom',
          callback: this.resizeCallback
        }} />

        <Resizer params={{
          resizeRight: true,
          resizeTop: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizeBottom: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-bottom',
          callback: this.resizeCallback
        }} />
      </div>
    )
  }
}
