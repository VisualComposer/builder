import React from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

export default class NavbarWrapper extends React.Component {
  state = {
    showGuideline: false,
    guidelinePosition: 'top',
    isDragging: false,
    isDisabled: true
  }

  componentDidMount () {
    document.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart)
    document.addEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd)
    document.addEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging)
    workspaceStorage.state('navbarDisabled').onChange(this.handleDisableChange.bind(this))
  }

  componentWillUnmount () {
    document.removeEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart)
    document.removeEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd)
    document.removeEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging)
    workspaceStorage.state('navbarDisabled').ignoreChange(this.handleDisableChange.bind(this))
  }

  handleDisableChange (isDisabled) {
    this.setState({ isDisabled })
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
    const { windowSize, navPosY, navPosX, navbarPosition } = e.eventData
    const navSize = 60
    const navSizeSide = 60 * 2
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
    const { guidelinePosition, isDragging, showGuideline } = this.state
    let draggingContent = ''
    if (isDragging) {
      let guidelineClasses = ['vcv-ui-navbar-guideline', 'vcv-ui-navbar-guideline-' + guidelinePosition]
      if (showGuideline) {
        guidelineClasses.push('vcv-ui-navbar-guideline-is-visible')
      }
      guidelineClasses = guidelineClasses.join(' ')
      draggingContent = (<div className={guidelineClasses} />)
    }

    const classes = classNames({
      'vcv-layout-bar-header': true,
      'vcv-layout-bar-header--loading': this.state.isDisabled
    })

    return (
      <div ref={this.props.wrapperRef} className={classes} id='vcv-editor-header'>
        <div id='vc-navbar-container'>
          {draggingContent}
          {this.props.children}
        </div>
      </div>
    )
  }
}
