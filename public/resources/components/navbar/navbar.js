import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import '../../../sources/less/ui/navbar/init.less'
import {getRealSize} from './tools'
const Utils = vcCake.getService('utils')
const boundingRectState = vcCake.getStorage('workspace').state('navbarBoundingRect')
const positionState = vcCake.getStorage('workspace').state('navbarPosition')

export default class Navbar extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    locked: React.PropTypes.bool,
    draggable: React.PropTypes.bool
  }
  constructor (props) {
    super(props)
    this.state = {
      visibleControls: this.setVisibleControls(),
      controlsCount: 0,
      saving: false,
      saved: false,
      isDragging: false,
      isDetached: false,
      navbarPosition: 'left',
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
    this.hiddenControlsIndex = []
    this.handleDropdown = this.handleDropdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.handleElementResize = this.handleElementResize.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.refreshControls = this.refreshControls.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragging = this.handleDragging.bind(this)
    this.setHiddenControlsReference = this.setHiddenControlsReference.bind(this)
    this.updateNavbarBounding = this.updateNavbarBounding.bind(this)
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
  componentWillMount () {
    const {draggable} = this.props
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

  componentDidMount () {
    boundingRectState.onChange(this.updateNavbarBounding)
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer'), this.handleElementResize)
    window.addEventListener('resize', lodash.debounce(this.handleWindowResize, 300))
    this.handleElementResize()
  }
  updateWrapper () {
    // TODO: move this method to wrapper itself
    const {locked} = this.props
    let { navPosX, navPosY, navbarPosition, navbarPositionFix } = this.state
    let navBarStyle = {}
    let manageLock = (shouldLocked) => {
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
      case 'right':
        manageLock(true)
        break
    }
    let targetStyle = document.body.querySelector('.vcv-layout-bar').style
    for (let prop in navBarStyle) {
      targetStyle[ prop ] = navBarStyle[ prop ]
    }
  }
  handleElementResize () {
    this.refreshControls(this.state.visibleControls)
  }

  handleWindowResize () {
    this.setState({
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      }
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
    let controls = children.filter((node) => {
      if (!visibleControls.includes(node.key)) {
        this.hiddenControlsIndex.push(node.key)
        return true
      }
    })
    this.hiddenControlsIndex.reverse()
    controls.reverse()
    return controls
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextState.visibleControls.length !== this.state.visibleControls.length) {
      this.refreshControls(nextState.visibleControls)
    }
  }
  closeDropdown (e) {
    if (e && (e.target.closest('.vcv-ui-navbar-dropdown-trigger') || e.target.closest('.vcv-ui-navbar-sandwich--stop-close')) && e.target.closest('.vcv-ui-navbar-sandwich')) {
      return
    }
    this.handleDropdown()
  }

  handleDropdown () {
    if (this.state.isActiveSandwich) {
      document.getElementById('vcv-editor-iframe').contentWindow.document.body.removeEventListener('click', this.closeDropdown)
      document.body.removeEventListener('click', this.closeDropdown)
    } else {
      document.getElementById('vcv-editor-iframe').contentWindow.document.body.addEventListener('click', this.closeDropdown)
      document.body.addEventListener('click', this.closeDropdown)
    }
    this.setState({
      isActiveSandwich: !this.state.isActiveSandwich
    })
  }
  setHiddenControlsReference (ref) {
    this.hiddenControlsWrapper = ref
  }
  buildHiddenControls () {
    const controls = this.getHiddenControls(this.state.visibleControls)
    if (!controls.length) {
      return
    }
    let sandwichClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-sandwich': true,
      'vcv-ui-navbar-dropdown--active': this.state.isActiveSandwich
    })

    return (
      <dl className={sandwichClasses}>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title='Menu' onClick={this.handleDropdown}>
          <span className='vcv-ui-navbar-control-content'><i
            className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu' /><span>Menu</span></span>
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels' ref={this.setHiddenControlsReference}>
          {controls}
        </dd>
      </dl>
    )
  }

  /**
   * Update controls to set visible or collapsed controls in bar.
   * @param visibleControls {array} of visible controls keys
   */
  refreshControls (visibleControls) {
    let isSideNavbar = () => {
      let sidePlacements = [ 'left', 'right' ]
      return sidePlacements.indexOf(this.state.navbarPosition) !== -1
    }

    // get free space
    let freeSpaceEl = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer')
    let freeSpace = isSideNavbar() ? freeSpaceEl.offsetHeight : freeSpaceEl.offsetWidth
    // hide control if there is no space
    let visibleAndUnpinnedControls = this.getVisibleControls(visibleControls).filter((control) => {
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
      return
    }
    // show controls if there is available space
    let hiddenAndUnpinnedControls = this.getHiddenControls(visibleControls).filter((control) => {
      return !control.props.visibility || control.props.visibility !== 'hidden'
    })
    if (hiddenAndUnpinnedControls.length) {
      // if it is last hidden element then add dropdown width to free space
      if (this.getHiddenControls(visibleControls).length === 1) {
        let sandwich = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-sandwich')
        freeSpace += isSideNavbar() ? sandwich.offsetHeight : sandwich.offsetWidth
      }
      while (freeSpace > 0 && hiddenAndUnpinnedControls.length) {
        const lastControl = hiddenAndUnpinnedControls.pop()
        const lastControlIndex = this.hiddenControlsIndex.indexOf(lastControl.key)
        const controlDOM = this.hiddenControlsWrapper.childNodes[lastControlIndex]
        if (!controlDOM) {
          break
        }
        const size = getRealSize(controlDOM, '.vcv-ui-navbar')
        let controlSize = isSideNavbar() ? size.height : size.width
        freeSpace -= controlSize
        if (freeSpace > 0) {
          visibleControls.push(lastControl.key)
        }
      }
      this.setState({
        visibleControls: visibleControls
      })
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

    let navbarPosition = ReactDOM.findDOMNode(this).getBoundingClientRect()
    this.setState({
      isDragging: true,
      navbarPositionFix: {
        top: e.nativeEvent.clientY - navbarPosition.top,
        left: e.nativeEvent.clientX - navbarPosition.left
      }
    })

    let moveStartEvent = document.createEvent('Event')
    moveStartEvent.eventData = this.state
    moveStartEvent.initEvent('vc.ui.navbar.drag-start', true, true)
    e.target.dispatchEvent(moveStartEvent)

    document.body.classList.add('vcv-ui-navbar-is-dragging')
    document.addEventListener('mousemove', this.handleDragging)
    document.addEventListener('mouseup', this.handleDragEnd)

    this.handleDragging(e.nativeEvent)
  }

  handleDragEnd (e) {
    let moveEndEvent = document.createEvent('Event')
    moveEndEvent.initEvent('vc.ui.navbar.drag-end', true, true)
    e.target.dispatchEvent(moveEndEvent)
    document.body.classList.remove('vcv-ui-navbar-is-dragging')
    document.removeEventListener('mousemove', this.handleDragging)
    document.removeEventListener('mouseup', this.handleDragEnd)

    // memorize navbar position
    Utils.setCookie('navPosition', this.state.navbarPosition)
    let posX = this.state.navPosX - this.state.navbarPositionFix.left
    let posY = this.state.navPosY - this.state.navbarPositionFix.top
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
      let newStates = {
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
      let navSize = 60 * 0.5
      let navSizeSide = 60
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

    let movingEvent = document.createEvent('Event')
    movingEvent.eventData = this.state
    movingEvent.initEvent('vc.ui.navbar.dragging', true, true)
    e.target.dispatchEvent(movingEvent)
  }
  renderDragHandler () {
    const {draggable} = this.props
    if (!draggable) {
      return true
    }
    return <div className='vcv-ui-navbar-drag-handler vcv-ui-drag-handler' onMouseDown={this.handleDragStart}>
      <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
    </div>
  }
  render () {
    let { isDragging } = this.state
    let navbarContainerClasses = classNames({
      'vcv-ui-navbar-container': true,
      'vcv-ui-navbar-is-detached': !isDragging
    })
    this.updateWrapper()
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
