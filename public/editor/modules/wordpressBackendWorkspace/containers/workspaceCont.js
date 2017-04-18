import React from 'react'
import ReactDOM from 'react-dom'
import PanelsContainer from './panelsContainer'
import NavbarContainer from './navbarContainer'
import Workspace from '../../../../resources/components/workspace'
import { getStorage } from 'vc-cake'

const workspace = getStorage('workspace')

export default class WorkspaceCont extends React.Component {
  static propTypes = {
    layout: React.PropTypes.object.isRequired,
    layoutHeader: React.PropTypes.object.isRequired
  }

  layoutBar = null
  panels = null

  constructor (props) {
    super(props)
    this.state = {
      contentStart: false,
      contentEnd: false,
      settings: {},
      isSticky: false,
      isStickyBottom: false,
      isStickyAboveTop: false,
      barLeftPos: 0,
      barTopPos: 0,
      barWidth: 0,
      adminBar: document.getElementById('wpadminbar')
    }
    this.setContentStart = this.setContentStart.bind(this)
    this.setContentEnd = this.setContentEnd.bind(this)
    this.handleNavbarPosition = this.handleNavbarPosition.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handleLayoutResize = this.handleLayoutResize.bind(this)
  }

  componentDidMount () {
    workspace.state('contentStart').onChange(this.setContentStart)
    workspace.state('contentEnd').onChange(this.setContentEnd)
    window.addEventListener('scroll', this.handleWindowScroll)
    this.addResizeListener(this.props.layout, this.handleLayoutResize)
    const layoutRect = this.props.layout.getBoundingClientRect()
    this.setState({ barWidth: layoutRect.width })
  }

  componentWillUnmount () {
    workspace.state('contentStart').ignoreChange(this.setContentStart)
    workspace.state('contentEnd').ignoreChange(this.setContentEnd)
    window.removeEventListener('scroll', this.handleWindowScroll)
    this.removeResizeListener(this.props.layout, this.handleLayoutResize)
  }

  componentDidUpdate (prevProps, prevState) {
    this.refreshHeaderHeight()
  }

  setContentEnd (value) {
    const contentEnd = value || false
    this.setState({contentEnd: contentEnd, settings: workspace.state('settings').get() || {}})
  }

  setContentStart (value) {
    this.setState({contentStart: value || false})
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
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

  handleLayoutResize () {
    const layoutRect = this.props.layout.getBoundingClientRect()
    this.setState({
      isSticky: false,
      isStickyBottom: false,
      isStickyAboveTop: false,
      barWidth: layoutRect.width
    })
    this.handleNavbarPosition()
  }

  handleWindowScroll () {
    this.handleNavbarPosition()
  }

  /**
   *  Set layout header height if navbar is sticky,
   *  to calculate proper position during window scroll
   */
  refreshHeaderHeight () {
    if (this.state.isSticky) {
      let bar = ReactDOM.findDOMNode(this.layoutBar).getBoundingClientRect()
      this.props.layoutHeader.style.height = `${bar.height}px`
    }
  }

  /**
   *  Set navbar position relative to layout, always within layout borders
   */
  handleNavbarPosition () {
    const { isSticky, isStickyBottom, isStickyAboveTop, adminBar } = this.state
    const layoutRect = this.props.layout.getBoundingClientRect()
    const layoutBar = ReactDOM.findDOMNode(this.layoutBar)
    const bar = layoutBar.getBoundingClientRect()
    const adminBarPos = window.getComputedStyle(adminBar).position
    const adminBarHeight = adminBarPos === 'absolute' ? 0 : adminBar.getBoundingClientRect().height
    // user scroll down, navbar becomes sticky
    if (layoutRect.top < adminBarHeight && !isSticky) {
      this.props.layoutHeader.style.height = `${bar.height}px`
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
      this.props.layoutHeader.removeAttribute('style')
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
    const { contentStart, contentEnd, settings, isSticky, barTopPos, barLeftPos, barWidth } = this.state

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
      <Workspace
        contentStart={!!contentStart}
        contentEnd={!!contentEnd}
        stickyBar={stickyBar}
        ref={(bar) => { this.layoutBar = bar }}
      >
        <NavbarContainer />
        <PanelsContainer
          start={contentStart}
          end={contentEnd}
          settings={settings}
          layoutWidth={barWidth}
          ref={(panels) => { this.panels = panels }}
        />
      </Workspace>
    )
  }
}
