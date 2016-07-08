/*eslint jsx-quotes: [2, "prefer-double"]*/
import Control from './control'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

require('../css/module.less')
var navbarControls = []

export class Navbar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      controlsCount: 0,
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
      moveDirection: {
        top: false,
        right: false,
        bottom: false,
        left: false
      }
    }
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
        isVisible: isControlVisible
      })
      this.props.api.notify('build', navbarControls.length)
    })
  }

  componentDidMount () {
    this.props.api
      .on('build', (count) => {
        this.setState({ controlsCount: count })
      })
      .reply('navbar:resizeTop', (offsetY) => {
        this.setState({ navPosY: this.state.navPosY - offsetY })
      })
      .reply('navbar:resizeLeft', (offsetX) => {
        this.setState({ navPosX: this.state.navPosX - offsetX })
      })

    // window.addEventListener('resize', this.refreshControls)
  }

  componentWillUnmount () {
    // window.removeEventListener('resize', this.refreshControls)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.navbarPosition !== this.state.navbarPosition) {
      this.props.api.notify('positionChanged', this.state.navbarPosition)
      // console.log(this.state.controlsCount)
      this.refreshControls()
    }
  }

  refreshControls () {
    // navbarControls[ 1 ].isVisible = !navbarControls[ 1 ].isVisible
    // console.log(1, navbarControls[ 1 ].isVisible)
    // console.log(this.getVisibleControls())
    //
  }

  getVisibleControls () {
    return navbarControls.filter((control) => {
      if (control.isVisible) {
        return true
      }
    })
  }

  getHiddenControls () {
    return navbarControls.filter((control) => {
      return !control.isVisible
    })
  }

  buildVisibleControls () {
    let controls = this.getVisibleControls()
    if (!controls.length) {
      return
    }
    return controls.map((value) => {
      return React.createElement(Control, {
        api: this.props.api,
        key: 'Navbar:' + value.name,
        value: value,
        container: '.vcv-ui-navbar',
        ref: (ref) => {
          navbarControls[ value.index ].ref = ref
        }
      })
    })
  }

  buildHiddenControls () {
    let controls = this.getHiddenControls()
    if (!controls.length) {
      return
    }
    let hiddenControls = controls.map((value) => {
      return React.createElement(Control, {
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
      <dl className="vcv-ui-navbar-dropdown vcv-ui-pull-end">
        <dt className="vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control" title="Menu">
          <span className="vcv-ui-navbar-control-content"><i
            className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu"></i><span>Menu</span></span>
        </dt>
        <dd className="vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels">
          {hiddenControls}
        </dd>
      </dl>
    )
  }

  handleDragStart (e) {
    e && e.preventDefault()
    if (e.nativeEvent.which !== 1) {
      return false
    }
    this.setState({
      isDragging: true,
      navbarSize: {
        height: ReactDOM.findDOMNode(this).offsetHeight,
        width: ReactDOM.findDOMNode(this).offsetWidth
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

    this.setState({
      isDragging: false
    })
  }

  handleDragging (e) {
    this.setState(function (previousState) {
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
    let { isDragging, navPosX, navPosY, navbarPosition } = this.state
    let navBarStyle = {}
    let isDetached
    let navSizeDetached = 60

    if (isDragging) {
      isDetached = false
    }

    if (navbarPosition === 'detached') {
      navBarStyle.top = navPosY - navSizeDetached / 2 + 'px'
      navBarStyle.left = navPosX - 7 + 'px'
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
            <i className="vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots"></i>
          </div>
          {this.buildVisibleControls()}
          {this.buildHiddenControls()}
          <div className="vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer"
            onMouseDown={this.handleDragStart}></div>
        </nav>
      </div>
    )
  }
}

Navbar.propTypes = {
  api: React.PropTypes.object.isRequired
}
module.exports = Navbar
