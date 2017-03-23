import React from 'react'
export default class NavbarWrapper extends React.Component {
  state = {
    showGuideline: false,
    guidelinePosition: 'top',
    isDragging: false
  }

  componentDidMount () {
    document.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart)
    document.addEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd)
    document.addEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging)
  }

  componentWillUnmount () {
    document.removeEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart)
    document.removeEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd)
    document.removeEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging)
  }

  handleNavbarDragStart = (e) => {
    this.setState({
      isDragging: true
    })
  }

  handleNavbarDragEnd = (e) => {
    this.setState({
      isDragging: false
    })
  }

  handleNavbarDragging = (e) => {
    let { windowSize, navPosY, navPosX, navbarPosition } = e.eventData
    let navSize = 60
    let navSizeSide = 60 * 2
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
  }

  render () {
    let { guidelinePosition, isDragging, showGuideline } = this.state
    let draggingContent = ''
    if (isDragging) {
      let guidelineClasses = [ 'vcv-ui-navbar-guideline', 'vcv-ui-navbar-guideline-' + guidelinePosition ]
      if (showGuideline) {
        guidelineClasses.push('vcv-ui-navbar-guideline-is-visible')
      }
      guidelineClasses = guidelineClasses.join(' ')
      draggingContent = (<div className={guidelineClasses} />)
    }

    return (
      <div className='vcv-layout-bar-header' id='vcv-editor-header'>
        <div id='vc-navbar-container'>
          {draggingContent}
          {this.props.children}
        </div>
      </div>
    )
  }
}
