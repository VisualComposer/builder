import NavbarControl from './control'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import '../../../../../sources/less/ui/navbar/init.less'

const Utils = vcCake.getService('utils')

let navbarControls = []

export default class Navbar extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      controlsCount: 0,
      visibleControlsCount: 0,
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
      editor: document.getElementById('vcv-editor'),
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
    this.handleDropdown = this.handleDropdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.handleElementResize = this.handleElementResize.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.refreshControls = this.refreshControls.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragging = this.handleDragging.bind(this)
  }

  componentWillMount () {
    this.props.api.addAction('addElement', (name, Icon, options = {}) => {
      if (!options.hasOwnProperty('pin') || typeof options.pin !== 'string') {
        options.pin = false
      }

      // set default visibility
      let isControlVisible
      switch (options.pin) {
        case 'visible':
          isControlVisible = true
          break
        case 'hidden':
          isControlVisible = false
          break
        default:
          isControlVisible = true
      }

      navbarControls.push({
        index: navbarControls.length,
        name: name,
        icon: Icon,
        pin: options.pin,
        options: options,
        isVisible: isControlVisible
      })
      this.props.api.notify('build', navbarControls.length)
    })

    // remember navbar position
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
    this.props.api
      .on('build', (count) => {
        this.setState({ controlsCount: count })
        this.handleElementResize()
      })
      .reply('navbar:resizeTop', (offsetY) => {
        this.setState({ navPosY: this.state.navPosY - offsetY })
      })
      .reply('navbar:resizeLeft', (offsetX) => {
        this.setState({ navPosX: this.state.navPosX - offsetX })
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
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer'), this.handleElementResize)
    window.addEventListener('resize', this.handleWindowResize)
    this.handleElementResize()
  }

  handleElementResize () {
    this.refreshControls()
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

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer'), this.handleElementResize)
    window.removeEventListener('resize', this.handleWindowResize)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.navbarPosition !== this.state.navbarPosition) {
      this.props.api.request('ui:settingsUpdated', this.state.navbarPosition)
    }
  }

  getVisibleControls () {
    return navbarControls.filter((control) => {
      if (control.isVisible) {
        return true
      }
    })
  }

  getHiddenControls () {
    let controls = navbarControls.filter((control) => {
      return !control.isVisible
    })
    controls.reverse()
    return controls
  }

  buildVisibleControls () {
    let controls = this.getVisibleControls()
    if (!controls.length) {
      return
    }
    return controls.map((value) => {
      return (<NavbarControl
        api={value.options.api ? value.options.api : this.props.api}
        key={'Navbar:' + value.name}
        value={value}
        container='.vcv-ui-navbar'
        ref={(ref) => {
          navbarControls[ value.index ].ref = ref
        }}
      />)
    })
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

  buildHiddenControls () {
    let controls = this.getHiddenControls()
    if (!controls.length) {
      return
    }
    let hiddenControls = controls.map((value) => {
      return React.createElement(NavbarControl, {
        api: this.props.api,
        key: 'Navbar:' + value.name,
        value: value,
        container: '.vcv-ui-navbar',
        ref: (ref) => {
          navbarControls[ value.index ].ref = ref
        }
      })
    })

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
        <dd className='vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels'>
          {hiddenControls}
        </dd>
      </dl>
    )
  }

  refreshControls () {
    let isSideNavbar = () => {
      let sidePlacements = [ 'left', 'right' ]
      return sidePlacements.indexOf(this.state.navbarPosition) !== -1
    }

    // get free space
    let freeSpaceEl = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer')
    let freeSpace = freeSpaceEl.offsetWidth
    if (isSideNavbar()) {
      freeSpace = freeSpaceEl.offsetHeight
    }

    // hide control if there is no space
    let visibleAndUnpinnedControls = this.getVisibleControls().filter((control) => {
      return control.isVisible && control.pin !== 'visible'
    })
    if (visibleAndUnpinnedControls.length && freeSpace === 0) {
      let lastControl = visibleAndUnpinnedControls.pop()
      navbarControls[ lastControl.index ].isVisible = false
      this.setState({
        visibleControlsCount: this.getVisibleControls().length
      })
      this.refreshControls()
      return
    }

    // show controls if there is available space
    let hiddenAndUnpinnedControls = this.getHiddenControls().filter((control) => {
      return !control.isVisible && control.pin !== 'hidden'
    })
    if (hiddenAndUnpinnedControls.length) {
      // if it is las hidden element than add dropdown width to free space
      if (this.getHiddenControls().length === 1) {
        let sandwich = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-sandwich')
        if (isSideNavbar()) {
          freeSpace += sandwich.offsetHeight
        } else {
          freeSpace += sandwich.offsetWidth
        }
      }

      while (freeSpace > 0 && hiddenAndUnpinnedControls.length) {
        let lastControl = hiddenAndUnpinnedControls.pop()
        let controlsSize = lastControl.ref.state.realSize.width
        if (isSideNavbar()) {
          controlsSize = lastControl.ref.state.realSize.height
        }
        freeSpace -= controlsSize
        if (freeSpace > 0) {
          navbarControls[ lastControl.index ].isVisible = true
        }
      }

      this.setState({
        visibleControlsCount: this.getVisibleControls().length
      })
      return
    }
    return
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
      let { editor } = this.state
      let editorSize = editor.getBoundingClientRect()
      if (newStates.navPosY < editorSize.top + navSize) {
        // if nav is on top
        if (previousState.navbarPosition !== 'top') {
          newStates.navbarPosition = 'top'
        }
      } else if (editorSize.bottom - navSize < newStates.navPosY) {
        // if nav is on bottom
        if (previousState.navbarPosition !== 'bottom') {
          newStates.navbarPosition = 'bottom'
        }
      } else if (newStates.navPosX < editorSize.left + navSizeSide) {
        // if nav is on left
        if (previousState.navbarPosition !== 'left') {
          newStates.navbarPosition = 'left'
        }
      } else if (editorSize.right - navSizeSide < newStates.navPosX) {
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

  render () {
    let { isDragging, navPosX, navPosY, navbarPosition, navbarPositionFix } = this.state
    let navBarStyle = {}
    let isDetached

    if (isDragging) {
      isDetached = false
    }
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

    switch (navbarPosition) {
      case 'detached':
        navBarStyle.top = navPosY - navbarPositionFix.top + 'px'
        navBarStyle.left = navPosX - navbarPositionFix.left + 'px'
        break
      case 'top':
      case 'bottom':
        manageLock(this.state.hasEndContent)
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

    let navbarContainerClasses = classNames({
      'vcv-ui-navbar-container': true,
      'vcv-ui-navbar-is-detached': isDetached
    })

    return (
      <div className={navbarContainerClasses}>
        <nav className='vcv-ui-navbar vcv-ui-navbar-hide-labels'>
          <div className='vcv-ui-navbar-drag-handler vcv-ui-drag-handler' onMouseDown={this.handleDragStart}>
            <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
          </div>
          {this.buildVisibleControls()}
          {this.buildHiddenControls()}
          <div className='vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer'
            onMouseDown={(e) => this.handleDragStart(e, false)} />
        </nav>
      </div>
    )
  }
}
