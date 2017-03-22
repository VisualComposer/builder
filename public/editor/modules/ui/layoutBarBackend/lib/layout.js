import React from 'react'
import BarContent from './content'
import BarHeader from './header'
import ClassNames from 'classnames'

export default class LayoutBar extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired
  }

  layoutHeader = this.props.layout.querySelector('.vcv-layout-header')
  layoutBar = null

  constructor (props) {
    super(props)
    this.state = {
      hasStartContent: false,
      hasEndContent: false,
      isSticky: false,
      isStickyBottom: false,
      isStickyAboveTop: false,
      barLeftPos: 0,
      barTopPos: 0,
      barWidth: 0,
      adminBar: document.getElementById('wpadminbar')
    }
    this.handleNavbarPosition = this.handleNavbarPosition.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handleLayoutResize = this.handleLayoutResize.bind(this)
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
    this.addResizeListener(this.props.layout, this.handleLayoutResize)
  }

  componentDidUpdate (prevProps, prevState) {
    this.refreshHeaderHeight()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleWindowScroll)
    this.removeResizeListener(this.props.layout, this.handleLayoutResize)
  }

  handleWindowScroll () {
    this.handleNavbarPosition()
  }

  handleLayoutResize () {
    this.setState({
      isSticky: false,
      isStickyBottom: false,
      isStickyAboveTop: false
    })
    this.handleNavbarPosition()
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

  /**
   *  Set layout header height if navbar is sticky,
   *  to calculate proper position during window scroll
   */
  refreshHeaderHeight () {
    if (this.state.isSticky) {
      let bar = this.layoutBar.getBoundingClientRect()
      this.layoutHeader.style.height = `${bar.height}px`
    }
  }

  /**
   *  Set navbar position relative to layout, always within layout borders
   */
  handleNavbarPosition () {
    let { isSticky, isStickyBottom, isStickyAboveTop, adminBar } = this.state
    let layoutRect = this.props.layout.getBoundingClientRect()
    let bar = this.layoutBar.getBoundingClientRect()
    let adminBarPos = window.getComputedStyle(adminBar).position
    let adminBarHeight = adminBarPos === 'absolute' ? 0 : adminBar.getBoundingClientRect().height
    // user scroll down, navbar becomes sticky
    if (layoutRect.top < adminBarHeight && !isSticky) {
      this.layoutHeader.style.height = `${bar.height}px`
      this.setState({
        isSticky: true,
        barLeftPos: layoutRect.left,
        barTopPos: adminBarHeight,
        barWidth: layoutRect.width
      })
    }
    // user scroll up, navbar gets initial position
    if (layoutRect.top > adminBarHeight && isSticky) {
      this.setState({
        isSticky: false,
        barWidth: layoutRect.width
      })
      this.layoutHeader.removeAttribute('style')
    }
    // user scroll down, stick navbar to bottom of layout
    if (layoutRect.bottom < adminBarHeight + bar.height && !isStickyAboveTop) {
      this.setState({
        isStickyBottom: true,
        barLeftPos: layoutRect.left,
        barTopPos: layoutRect.bottom - bar.height,
        barWidth: layoutRect.width
      })
    }
    // user scroll down, stick navbar above visible layout area
    if (layoutRect.bottom < adminBarHeight && !isStickyAboveTop) {
      this.setState({
        isStickyAboveTop: true,
        barLeftPos: layoutRect.left,
        barTopPos: adminBarHeight - bar.height,
        barWidth: layoutRect.width
      })
    }
    // user scroll up, stick navbar to bottom of layout
    if (layoutRect.bottom > adminBarHeight && isStickyAboveTop) {
      this.setState({
        isStickyAboveTop: false,
        barLeftPos: layoutRect.left,
        barTopPos: layoutRect.bottom - bar.height,
        barWidth: layoutRect.width
      })
    }
    // user scroll up, stick navbar to top, after stick to layout bottom
    if (layoutRect.bottom > adminBarHeight + bar.height && isStickyBottom) {
      this.setState({
        isStickyBottom: false,
        barLeftPos: layoutRect.left,
        barTopPos: adminBarHeight,
        barWidth: layoutRect.width
      })
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
        <BarContent api={api} layoutWidth={barWidth} />
      </div>
    )
  }
}
