/* eslint jsx-quotes: [2, "prefer-double"] */
import NavbarControl from './control'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import '../css/module.less'

let navbarControls = []

class Navbar extends React.Component {
  state = {
    controlsCount: 0,
    visibleControlsCount: 0,
    saving: false,
    saved: false,
    isDragging: false,
    isDetached: false,
    navbarPosition: 'top',
    navPosX: 0,
    navPosY: 0,
    windowSize: {
      height: window.innerHeight,
      width: window.innerWidth
    },
    navbarSize: {
      height: undefined,
      width: undefined
    },
    navbarPositionFix: {
      top: undefined,
      left: undefined
    },
    moveDirection: {
      top: false,
      right: false,
      bottom: false,
      left: false
    }
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
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer'), this.handleElementResize)
    this.handleElementResize()
  }

  handleElementResize = () => {
    this.refreshControls()
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
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
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.navbarPosition !== this.state.navbarPosition) {
      this.props.api.notify('positionChanged', this.state.navbarPosition)
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
        container=".vcv-ui-navbar"
        ref={(ref) => {
          navbarControls[ value.index ].ref = ref
        }}
      />)
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

    return (
      <dl className="vcv-ui-navbar-dropdown vcv-ui-pull-end vcv-ui-navbar-sandwich">
        <dt className="vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control" title="Menu">
          <span className="vcv-ui-navbar-control-content"><i
            className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu" /><span>Menu</span></span>
        </dt>
        <dd className="vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels">
          {hiddenControls}
        </dd>
      </dl>
    )
  }

  refreshControls = () => {
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
      if (hiddenAndUnpinnedControls.length === 1) {
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
  }

  handleDragStart = (e, dragWithHandler = true) => {
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
      navbarSize: {
        height: ReactDOM.findDOMNode(this).offsetHeight,
        width: ReactDOM.findDOMNode(this).offsetWidth
      },
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

  handleDragEnd = (e) => {
    let moveEndEvent = document.createEvent('Event')
    moveEndEvent.initEvent('vc.ui.navbar.drag-end', true, true)
    e.target.dispatchEvent(moveEndEvent)
    document.body.classList.remove('vcv-ui-navbar-is-dragging')
    document.removeEventListener('mousemove', this.handleDragging)
    document.removeEventListener('mouseup', this.handleDragEnd)

    this.setState({
      isDragging: false
    })
  }

  handleDragging = (e) => {
    this.setState((previousState) => {
      let newStates = {
        moveDirection: {
          left: false,
          right: false,
          top: false,
          bottom: false
        },
        navbarSize: {
          height: ReactDOM.findDOMNode(this).offsetHeight,
          width: ReactDOM.findDOMNode(this).offsetWidth
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
      // if (newStates.navbarPosition && (previousState.navbarPosition !== newStates.navbarPosition)) {
      //   this.props.api.notify('positionChanged', newStates.navbarPosition)
      // }
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

    if (navbarPosition === 'detached') {
      navBarStyle.top = navPosY - navbarPositionFix.top + 'px'
      navBarStyle.left = navPosX - navbarPositionFix.left + 'px'
    }

    let targetStyle = document.body.querySelector('.vcv-layout-bar').style
    for (let prop in navBarStyle) {
      targetStyle[ prop ] = navBarStyle[ prop ]
    }

    let navbarContainerClasses = classNames({
      'vcv-ui-navbar-container': true,
      'vcv-ui-navbar-is-detached': isDetached
    })

    for (let i = 0; i < document.body.classList.length; i++) {
      if (document.body.classList.item(i).search('vcv-layout-dock--') === 0) {
        document.body.classList.remove(document.body.classList.item(i))
      }
    }
    document.body.classList.add('vcv-layout-dock--unlock')
    document.body.classList.add('vcv-layout-dock')
    document.body.classList.add('vcv-layout-dock--' + navbarPosition)
    return (
      <div className={navbarContainerClasses}>
        <nav className="vcv-ui-navbar vcv-ui-navbar-hide-labels">
          <div className="vcv-ui-navbar-drag-handler vcv-ui-drag-handler" onMouseDown={this.handleDragStart}>
            <i className="vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots" />
          </div>
          {this.buildVisibleControls()}
          {this.buildHiddenControls()}
          <div className="vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer"
            onMouseDown={(e) => this.handleDragStart(e, false)} />
        </nav>
      </div>
    )
  }
}
Navbar.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default Navbar
