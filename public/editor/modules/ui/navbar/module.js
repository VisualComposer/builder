/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-navbar', function (api) {
  var React = require('react')
  var ReactDOM = require('react-dom')

  var Navbar = require('./lib/navbar')

  var NavbarContainer = React.createClass({
    getInitialState () {
      return {
        showOverlay: false,
        showGuideline: false,
        guidelinePosition: 'top',
        isDragging: false
      }
    },
    componentDidMount: function () {
      document.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart, false)
      document.addEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd, false)
      document.addEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging, false)
    },

    componentWillUnmount: function () {
      document.removeEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart)
      document.removeEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd)
      document.removeEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging)
    },

    handleNavbarDragStart: function (e) {
      this.setState({
        isDragging: true,
        showOverlay: true
      })
    },
    handleNavbarDragEnd: function (e) {
      this.setState({
        isDragging: false,
        showOverlay: false
      })
    },
    handleNavbarDragging: function (e) {
      let { windowSize, navPosY, navPosX, navbarPosition } = e.eventData
      var navSize = 60
      var navSizeSide = 60 * 2
      if (navbarPosition === 'detached') {
        // if nav is on top
        if (navPosY < navSize) {
          this.setState({
            showGuideline: true,
            guidelinePosition: 'top'
          })
          return
        }
        // if nav is on bottom
        if (windowSize.height - navSize < navPosY) {
          this.setState({
            showGuideline: true,
            guidelinePosition: 'bottom'
          })
          return
        }
        // if nav is on left
        if (navPosX < navSizeSide) {
          this.setState({
            showGuideline: true,
            guidelinePosition: 'left'
          })
          return
        }
        // if nav is on right
        if (windowSize.width - navSizeSide < navPosX) {
          this.setState({
            showGuideline: true,
            guidelinePosition: 'right'
          })
          return
        }
      }
      this.setState({
        showGuideline: false
      })
    },

    render: function () {
      let { showOverlay, guidelinePosition, isDragging, showGuideline } = this.state
      return (
        <div id="vc-navbar-container">
          {(() => {
            if (showOverlay) {
              return <div className="vcv-ui-navbar-drag-overlay"></div>
            }
          })()}
          {(() => {
            if (isDragging) {
              let guidelineClasses = [ 'vcv-ui-navbar-guideline', 'vcv-ui-navbar-guideline-' + guidelinePosition ]
              if (showGuideline) {
                guidelineClasses.push('vcv-ui-navbar-guideline-is-visible')
              }
              guidelineClasses = guidelineClasses.join(' ')
              return <div className={guidelineClasses}></div>
            }
          })()}
          <Navbar api={api} />
        </div>
      )
    }
  })
  module.exports = (NavbarContainer)

// Here comes wrapper for navbar
  var editorWrapper = document.querySelector('#vcv-editor-header')
  ReactDOM.render(
    <NavbarContainer />,
    editorWrapper
  )
})
