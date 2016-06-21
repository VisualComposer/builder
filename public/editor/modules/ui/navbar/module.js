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
        navbarPosition: 'top',
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
        showOverlay: true,
        navbarPosition: e.eventData.navbarNewPosition
      })
    },
    handleNavbarDragEnd: function (e) {
      this.setState({
        isDragging: false,
        showOverlay: false
      })
    },
    handleNavbarDragging: function (e) {
      let { navbarSize, navbarNewPosition, windowSize } = e.eventData
      switch (navbarNewPosition) {
        case 'top':
          if (e.eventData.navPosY - navbarSize.height / 2 < navbarSize.height &&
            e.eventData.navPosY - navbarSize.height / 2 >= navbarSize.height / 2) {
            this.setState({
              showGuideline: true
            })
          } else {
            this.setState({
              showGuideline: false
            })
          }
          break

        case 'left':
          if (e.eventData.navPosX - navbarSize.width / 2 < navbarSize.width &&
            e.eventData.navPosX - navbarSize.width / 2 >= navbarSize.width / 2) {
            this.setState({
              showGuideline: true
            })
          } else {
            this.setState({
              showGuideline: false
            })
          }
          break

        case 'bottom':
          if (windowSize.height - (e.eventData.navPosY + navbarSize.height / 2) < navbarSize.height &&
            windowSize.height - (e.eventData.navPosY + navbarSize.height / 2) >= navbarSize.height / 2) {
            this.setState({
              showGuideline: true
            })
          } else {
            this.setState({
              showGuideline: false
            })
          }
          break
        case 'right':
          if (windowSize.height - (e.eventData.navPosX + navbarSize.width / 2) < navbarSize.width &&
            windowSize.height - (e.eventData.navPosX - navbarSize.width / 2) >= navbarSize.width / 2) {
            this.setState({
              showGuideline: true
            })
          } else {
            this.setState({
              showGuideline: false
            })
          }
          break
      }
    },

    render: function () {
      let { showOverlay, navbarPosition, isDragging, showGuideline } = this.state

      return (
        <div id="vc-navbar-container">
          {(() => {
            if (showOverlay) {
              return <div className="vcv-ui-navbar-overlay"></div>
            }
          })()}
          {(() => {
            if (isDragging) {
              let guidelineClasses = [ 'vcv-ui-navbar-guideline', 'vcv-ui-navbar-guideline-' + navbarPosition ]
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
