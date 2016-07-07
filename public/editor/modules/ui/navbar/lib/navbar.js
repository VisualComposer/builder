/*eslint jsx-quotes: [2, "prefer-double"]*/
import Control from './control'
var React = require('react')
var ReactDOM = require('react-dom')
// var TreeElement = require( '../layouts/tree/TreeLayout' )
// var AddElementModal = require( './add-element/AddElement.js' )
var classNames = require('classnames')

require('../css/module.less')
var navbarControls = []

var Navbar = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
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
      },
      visibilityList: {}
    }
  },
  componentWillMount: function () {
    this.props.api.addAction('addElement', function (name, Icon) {
      navbarControls.push({ name: name, icon: Icon })
      this.props.api.notify('build', navbarControls.length)
    }.bind(this))
  },
  componentDidMount: function () {
    this.props.api.on('build', function (count) {
      this.setState({ controlsCount: count })
    }.bind(this))

    this.props.api.reply('navbar:resizeTop', (offsetY) => {
      this.setState({ navPosY: this.state.navPosY - offsetY })
    })
    this.props.api.reply('navbar:resizeLeft', (offsetX) => {
      this.setState({ navPosX: this.state.navPosX - offsetX })
    })
  },
  /**
   * Handler for position visibility for controls in navbar
   * @param key
   * @param visible
   */
  setControlVisibility: function (key, visible = true) {
    var visibilityList = this.state.visibilityList
    visibilityList[ key ] = visible
    this.setState({ visibilityList: visibilityList })
  },
  buildControls: function () {
    return navbarControls.map((value) => {
      return React.createElement(Control, {
        key: 'Navbar:' + value.name,
        value: value,
        visibilityHandler: this.setControlVisibility
      })
    })
  },
  handleDragStart (e) {
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
  },

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
    this.props.api.notify('positionChanged')
  },

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
        newStates.navbarPosition = 'top'
      } else if (this.state.windowSize.height - navSize < newStates.navPosY) {
        // if nav is on bottom
        newStates.navbarPosition = 'bottom'
      } else if (newStates.navPosX < navSizeSide) {
        // if nav is on left
        newStates.navbarPosition = 'left'
      } else if (this.state.windowSize.width - navSizeSide < newStates.navPosX) {
        // if nav is on right
        newStates.navbarPosition = 'right'
      } else {
        newStates.navbarPosition = 'detached'
      }
      return newStates
    })

    let movingEvent = document.createEvent('Event')
    movingEvent.eventData = this.state
    movingEvent.initEvent('vc.ui.navbar.dragging', true, true)
    e.target.dispatchEvent(movingEvent)
  },
  btnClickHandler: function () {
    this.props.api.notify('resize')
  },
  render: function () {
    let { isDragging, navPosX, navPosY, navbarPosition } = this.state
    let navBarStyle = {
    }
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
      if (document.body.classList.item(i).search('vcv-layout-placement--') === 0) {
        document.body.classList.remove(document.body.classList.item(i))
      }
    }
    document.body.classList.add('vcv-layout-placement')
    document.body.classList.add('vcv-layout-placement--' + navbarPosition)
    return (
      <div className={navbarContainerClasses}>
        <nav className="vcv-ui-navbar vcv-ui-navbar-hide-labels">
          <div className="vcv-ui-navbar-drag-handler vcv-ui-drag-handler" onMouseDown={this.handleDragStart}>
            <i className="vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots"></i>
          </div>
          {this.buildControls()}
        </nav>
      </div>
    )
  }
})
module.exports = Navbar
