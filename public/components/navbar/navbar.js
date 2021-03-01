import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import { getRealSize } from './tools'
import { Scrollbars } from 'react-custom-scrollbars'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const Utils = vcCake.getService('utils')
const boundingRectState = vcCake.getStorage('workspace').state('navbarBoundingRect')
const positionState = vcCake.getStorage('workspace').state('navbarPosition')
const wordpressBackendDataStorage = vcCake.getStorage('wordpressData')
const workspaceSettings = vcCake.getStorage('workspace').state('settings')
const dataManager = vcCake.getService('dataManager')

export default class Navbar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    locked: PropTypes.bool,
    draggable: PropTypes.bool,
    editor: PropTypes.string
  }

  constructor (props) {
    super(props)
    let navbarPosition = 'left'
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile()) {
      this.isMobile = true
      navbarPosition = 'top'
    }
    this.state = {
      visibleControls: this.setVisibleControls(),
      controlsCount: 0,
      saving: false,
      saved: false,
      isDragging: false,
      isDetached: false,
      navbarPosition: navbarPosition,
      navPosX: 0,
      navPosY: 0,
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      navbarPositionFix: {
        top: 0,
        left: 0
      },
      moveDirection: {
        top: false,
        right: false,
        bottom: false,
        left: false
      },
      hasEndContent: false,
      isActiveSandwich: false
    }

    this.menuButtonRef = React.createRef()

    if (this.isMobile && vcCake.env('editor') === 'frontend') {
      let isScrolling = 0

      window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling)
        isScrolling = setTimeout(() => {
          window.scrollTo(0, 0)
        }, 66)
      }, false)
    }

    this.hiddenControlsIndex = []
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleElementResize = this.handleElementResize.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.refreshControls = this.refreshControls.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragging = this.handleDragging.bind(this)
    this.setHiddenControlsReference = this.setHiddenControlsReference.bind(this)
    this.updateNavbarBounding = this.updateNavbarBounding.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  setVisibleControls () {
    const children = React.Children.toArray(this.props.children)
    return children.filter((node) => {
      return !node.props.visibility || node.props.visibility !== 'hidden'
    }).map((node) => {
      return node.key
    })
  }

  updateNavbarBounding (data) {
    this.setState({
      navPosX: this.state.navPosX - data.resizeLeft,
      navPosY: this.state.navPosY - data.resizeTop
    })
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
    const { draggable } = this.props
    if (!draggable) {
      this.setState({
        navPosX: 0,
        navPosY: 0,
        navbarPosition: 'top'
      })
      return
    }
    // TODO: move all this logic to wrapper
    let cookieState = {}
    if (Utils.hasCookie('navPosition')) {
      cookieState.navbarPosition = Utils.getCookie('navPosition')
    }
    if (Utils.hasCookie('navPosX') && Utils.hasCookie('navPosY')) {
      cookieState.navPosX = Utils.getCookie('navPosX')
      cookieState.navPosY = Utils.getCookie('navPosY')
      if (cookieState.navPosX > this.state.windowSize.width) {
        if (Utils.hasCookie('navPosXr')) {
          cookieState.navPosX = Math.ceil(this.state.windowSize.width * Utils.getCookie('navPosXr'))
        } else {
          cookieState.navPosX = 0
        }
      }
      if (cookieState.navPosY > this.state.windowSize.height) {
        if (Utils.hasCookie('navPosYr')) {
          cookieState.navPosY = Math.ceil(this.state.windowSize.height * Utils.getCookie('navPosYr'))
        } else {
          cookieState.navPosY = 0
        }
      }
    }
    this.setState(cookieState)
  }

  /* eslint-enable */

  componentDidMount () {
    boundingRectState.onChange(this.updateNavbarBounding)
    const currentDOMElement = window.document.querySelector('.vcv-ui-navbar-controls-spacer')
    if (currentDOMElement) {
      this.addResizeListener(currentDOMElement, this.handleElementResize)
      window.addEventListener('resize', lodash.debounce(this.handleWindowResize, 300))
      wordpressBackendDataStorage.state('activeEditor').onChange(this.handleVisibilityChange)
      this.handleElementResize()
    }
  }

  updateWrapper () {
    if (this.props.editor && this.props.editor === 'backend') {
      return
    }
    // TODO: move this method to wrapper itself
    const { locked } = this.props
    const { navPosX, navPosY, navbarPosition, navbarPositionFix } = this.state
    const navBarStyle = {}
    const manageLock = (shouldLocked) => {
      if (shouldLocked) {
        document.body.classList.remove('vcv-layout-dock--unlock')
        document.body.classList.add('vcv-layout-dock--lock')
      } else {
        document.body.classList.remove('vcv-layout-dock--lock')
        document.body.classList.add('vcv-layout-dock--unlock')
      }
    }

    for (let i = 0; i < document.body.classList.length; i++) {
      if (document.body.classList.item(i).search('vcv-layout-dock--') === 0) {
        document.body.classList.remove(document.body.classList.item(i))
      }
    }

    document.body.classList.add('vcv-layout-dock')
    document.body.classList.add('vcv-layout-dock--' + navbarPosition)
    if (!document.body.querySelector('.vcv-layout-bar')) {
      return
    }
    switch (navbarPosition) {
      case 'detached':
        navBarStyle.top = navPosY - navbarPositionFix.top + 'px'
        navBarStyle.left = navPosX - navbarPositionFix.left + 'px'
        break
      case 'top':
      case 'bottom':
        manageLock(locked)
        break
      case 'left':
      case 'right': {
        const currentSettings = workspaceSettings.get()
        if (currentSettings && currentSettings.action && currentSettings.action === 'addHub') {
          manageLock(false)
        } else {
          manageLock(true)
        }
        break
      }
    }
    const targetStyle = document.body.querySelector('.vcv-layout-bar').style
    for (const prop in navBarStyle) {
      targetStyle[prop] = navBarStyle[prop]
    }
  }

  handleElementResize () {
    this.refreshControls(this.state.visibleControls)
  }

  handleVisibilityChange () {
    this.refreshControls(this.state.visibleControls, true)
  }

  handleWindowResize () {
    let navbarPosition = this.state.navbarPosition
    if (this.isMobile) {
      navbarPosition = 'top'
    }

    this.setState({
      navbarPosition,
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      }
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

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer'), this.handleElementResize)
    window.removeEventListener('resize', this.handleWindowResize)
    wordpressBackendDataStorage.state('activeEditor').ignoreChange(this.handleVisibilityChange)
    boundingRectState.ignoreChange(this.updateNavbarBounding)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.navbarPosition !== this.state.navbarPosition) {
      positionState.set(this.state.navbarPosition)
      // this.props.api.request('ui:settingsUpdated', this.state.navbarPosition)
    }
  }

  getVisibleControls (visibleControls) {
    const children = React.Children.toArray(this.props.children)
    return children.filter((node) => {
      return visibleControls.includes(node.key)
    })
  }

  getHiddenControls (visibleControls) {
    const children = React.Children.toArray(this.props.children)
    this.hiddenControlsIndex = []
    const controls = children.filter((node) => {
      if (!visibleControls.includes(node.key)) {
        this.hiddenControlsIndex.push(node.key)
        return true
      }
    })
    this.hiddenControlsIndex.reverse()
    controls.reverse()
    return controls
  }

  /* eslint-disable */
  UNSAFE_componentWillUpdate (nextProps, nextState) {
    if (nextState.visibleControls.length !== this.state.visibleControls.length) {
      setTimeout(() => {
        this.refreshControls(nextState.visibleControls)
      }, 1)
    }
  }
  /* eslint-enable */

  handleDropdown (e) {
    if (e.type === 'mouseenter') {
      this.menuButtonRef.current.classList.remove('vcv-ui-navbar-control-no-hover')
    } else {
      this.menuButtonRef.current.classList.add('vcv-ui-navbar-control-no-hover')
    }
    this.setState({
      isActiveSandwich: e.type === 'mouseenter'
    })
  }

  setHiddenControlsReference (ref) {
    this.hiddenControlsWrapper = ref
  }

  buildHiddenControls () {
    const localizations = dataManager.get('localizations')
    const menuTitle = localizations ? localizations.menu : 'Menu'

    const controls = this.getHiddenControls(this.state.visibleControls)
    if (!controls.length) {
      return
    }
    const sandwichClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-sandwich': true,
      'vcv-ui-navbar-dropdown--active': this.state.isActiveSandwich
    })

    const hideTracksWhenNotNeeded = true

    return (
      <dl className={sandwichClasses} onMouseEnter={this.handleDropdown} onMouseLeave={this.handleDropdown}>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control vcv-ui-navbar-control-no-hover' ref={this.menuButtonRef} title={menuTitle}>
          <span className='vcv-ui-navbar-control-content'>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu' />
            <span>{menuTitle}</span>
          </span>
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels'>
          <Scrollbars
            ref='scrollbars'
            renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
            renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
            renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
            renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
            renderView={props => <div {...props} className='vcv-ui-scroll-content' />}
            hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
            autoHeight
            autoHeightMax='80vh'
          >
            <div ref={this.setHiddenControlsReference}>
              {controls}
            </div>
          </Scrollbars>
        </dd>
      </dl>
    )
  }

  /**
   * Set inline styles to content in hidden metabox for further calculations
   * @param metabox element
   */
  setMetaboxInlineStyles (metabox) {
    const inside = metabox.querySelector('.inside')
    metabox.style.overflow = 'hidden'
    inside.style.position = 'absolute'
    inside.style.top = '0'
    inside.style.display = 'block'
    inside.style.visibility = 'hidden'
    inside.style.width = '100%'
  }

  /**
   * Remove inline styles from hidden metabox
   * @param metabox element
   */
  removeMetaboxInlineStyles (metabox) {
    const inside = metabox.querySelector('.inside')
    metabox.removeAttribute('style')
    inside.removeAttribute('style')
  }

  /**
   * Update controls to set visible or collapsed controls in bar.
   * @param visibleControls {array} of visible controls keys
   */
  refreshControls (visibleControls, refreshMetaBox = false) {
    const isSideNavbar = () => {
      const sidePlacements = ['left', 'right']
      return sidePlacements.indexOf(this.state.navbarPosition) !== -1
    }

    const metabox = document.getElementById('vcwb_visual_composer')
    // Condition for collapsed initial metabox
    if (refreshMetaBox || (metabox && ReactDOM.findDOMNode(this).getBoundingClientRect().width === 0)) {
      this.setMetaboxInlineStyles(metabox)
    }

    // get free space
    const freeSpaceEl = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer')
    let freeSpace = isSideNavbar() ? freeSpaceEl.offsetHeight : freeSpaceEl.offsetWidth
    // hide control if there is no space
    const visibleAndUnpinnedControls = this.getVisibleControls(visibleControls).filter((control) => {
      return !control.props.visibility || control.props.visibility !== 'pinned'
    }).map((control) => {
      return control.key
    })
    if (visibleAndUnpinnedControls.length && freeSpace === 0) {
      const keyToRemove = visibleAndUnpinnedControls.pop()
      const newVisibleControls = visibleControls.filter(item => item !== keyToRemove)
      this.setState({
        visibleControls: newVisibleControls
      })
      if (metabox) {
        this.removeMetaboxInlineStyles(metabox)
      }
      return
    }
    // show controls if there is available space
    const hiddenAndUnpinnedControls = this.getHiddenControls(visibleControls).filter((control) => {
      return !control.props.visibility || control.props.visibility !== 'hidden'
    })
    if (hiddenAndUnpinnedControls.length) {
      // if it is last hidden element then add dropdown width to free space
      if (this.getHiddenControls(visibleControls).length === 1) {
        const sandwich = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-sandwich')
        freeSpace += isSideNavbar() ? sandwich.offsetHeight : sandwich.offsetWidth
      }
      while (freeSpace > 0 && hiddenAndUnpinnedControls.length) {
        const lastControl = hiddenAndUnpinnedControls.pop()
        const lastControlIndex = this.hiddenControlsIndex.indexOf(lastControl.key)
        const controlDOM = this.hiddenControlsWrapper.childNodes[lastControlIndex]
        if (!controlDOM || controlDOM.nodeType !== controlDOM.ELEMENT_NODE) {
          break
        }
        const size = getRealSize(controlDOM, '.vcv-ui-navbar')
        const controlSize = isSideNavbar() ? size.height : size.width
        freeSpace -= controlSize
        if (freeSpace > 0) {
          visibleControls.push(lastControl.key)
        }
      }
      this.setState({
        visibleControls: visibleControls
      })
    }
    if (metabox) {
      this.removeMetaboxInlineStyles(metabox)
    }
  }

  handleDragStart (e, dragWithHandler = true) {
    e && e.preventDefault()
    if (e.nativeEvent.which !== 1) {
      return
    }

    // if stacked than can't drag on empty space
    if (!dragWithHandler && this.state.navbarPosition !== 'detached') {
      return
    }

    const navbarPosition = ReactDOM.findDOMNode(this).getBoundingClientRect()
    this.setState({
      isDragging: true,
      navbarPositionFix: {
        top: e.nativeEvent.clientY - navbarPosition.top,
        left: e.nativeEvent.clientX - navbarPosition.left
      }
    })

    const moveStartEvent = document.createEvent('Event')
    moveStartEvent.eventData = this.state
    moveStartEvent.initEvent('vc.ui.navbar.drag-start', true, true)
    e.target.dispatchEvent(moveStartEvent)

    document.body.classList.add('vcv-ui-navbar-is-dragging')
    document.addEventListener('mousemove', this.handleDragging)
    document.addEventListener('mouseup', this.handleDragEnd)

    this.handleDragging(e.nativeEvent)
  }

  handleDragEnd (e) {
    const moveEndEvent = document.createEvent('Event')
    moveEndEvent.initEvent('vc.ui.navbar.drag-end', true, true)
    e.target.dispatchEvent(moveEndEvent)
    document.body.classList.remove('vcv-ui-navbar-is-dragging')
    document.removeEventListener('mousemove', this.handleDragging)
    document.removeEventListener('mouseup', this.handleDragEnd)

    // memorize navbar position
    Utils.setCookie('navPosition', this.state.navbarPosition)
    const posX = this.state.navPosX - this.state.navbarPositionFix.left
    const posY = this.state.navPosY - this.state.navbarPositionFix.top
    Utils.setCookie('navPosX', posX)
    Utils.setCookie('navPosY', posY)
    Utils.setCookie('navPosXr', 1 / (this.state.windowSize.width / posX))
    Utils.setCookie('navPosYr', 1 / (this.state.windowSize.height / posY))

    // update state
    this.setState({
      isDragging: false
    })
  }

  handleDragging (e) {
    this.setState((previousState) => {
      const newStates = {
        moveDirection: {
          left: false,
          right: false,
          top: false,
          bottom: false
        },
        navPosX: e.clientX,
        navPosY: e.clientY
      }

      // get move direction
      if (previousState.navPosX > e.clientX) {
        newStates.moveDirection.left = true
      } else if (previousState.navPosX < e.clientX) {
        newStates.moveDirection.right = true
      }
      if (previousState.navPosY > e.clientY) {
        newStates.moveDirection.top = true
      } else if (previousState.navPosY < e.clientY) {
        newStates.moveDirection.bottom = true
      }

      // get new position
      const navSize = 60 * 0.5
      const navSizeSide = 60
      if (newStates.navPosY < navSize) {
        // if nav is on top
        if (previousState.navbarPosition !== 'top') {
          newStates.navbarPosition = 'top'
        }
      } else if (this.state.windowSize.height - navSize < newStates.navPosY) {
        // if nav is on bottom
        if (previousState.navbarPosition !== 'bottom') {
          newStates.navbarPosition = 'bottom'
        }
      } else if (newStates.navPosX < navSizeSide) {
        // if nav is on left
        if (previousState.navbarPosition !== 'left') {
          newStates.navbarPosition = 'left'
        }
      } else if (this.state.windowSize.width - navSizeSide < newStates.navPosX) {
        // if nav is on right
        if (previousState.navbarPosition !== 'right') {
          newStates.navbarPosition = 'right'
        }
      } else {
        if (previousState.navbarPosition !== 'detached') {
          newStates.navbarPosition = 'detached'
        }
      }
      return newStates
    })

    const movingEvent = document.createEvent('Event')
    movingEvent.eventData = this.state
    movingEvent.initEvent('vc.ui.navbar.dragging', true, true)
    e.target.dispatchEvent(movingEvent)
  }

  renderDragHandler () {
    const { draggable } = this.props
    if (!draggable || this.isMobile) {
      return true
    }
    return (
      <div className='vcv-ui-navbar-drag-handler vcv-ui-drag-handler' onMouseDown={this.handleDragStart}>
        <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
      </div>
    )
  }

  render () {
    const { isDragging } = this.state
    const navbarContainerClasses = classNames({
      'vcv-ui-navbar-container': true,
      'vcv-ui-navbar-is-detached': !isDragging
    })
    this.updateWrapper()
    if (this.props.editor !== 'backend') {
      this.props.getNavbarPosition(this.state.navbarPosition)
    }

    return (
      <div className={navbarContainerClasses}>
        <nav className='vcv-ui-navbar vcv-ui-navbar-hide-labels'>
          {this.renderDragHandler()}
          {this.getVisibleControls(this.state.visibleControls)}
          {this.buildHiddenControls(this.state.visibleControls)}
          <div className='vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer' onMouseDown={(e) => this.handleDragStart(e, false)} />
        </nav>
      </div>
    )
  }
}
