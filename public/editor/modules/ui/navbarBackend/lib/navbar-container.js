import React from 'react'
import Navbar from './navbar'

export default class NavbarContainer extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showGuideline: false,
      guidelinePosition: 'top',
      isDragging: false,
      editor: document.getElementById('vcv-editor'),
      guidelineStyles: null
    }
    this.handleNavbarDragStart = this.handleNavbarDragStart.bind(this)
    this.handleNavbarDragEnd = this.handleNavbarDragEnd.bind(this)
    this.handleNavbarDragging = this.handleNavbarDragging.bind(this)
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

  handleNavbarDragStart () {
    this.setState({
      isDragging: true
    })
  }

  handleNavbarDragEnd () {
    this.setState({
      isDragging: false
    })
  }

  handleNavbarDragging (e) {
    let { navPosY, navPosX, navbarPosition } = e.eventData
    let navSize = 60
    let navSizeSide = 60 * 2
    let { editor } = this.state
    let editorSize = editor.getBoundingClientRect()
    if (navbarPosition === 'detached') {
      // if nav is on top
      if (navPosY < editorSize.top + navSize) {
        this.setState({
          showGuideline: true,
          guidelinePosition: 'top',
          guidelineStyles: {
            top: editorSize.top,
            left: editorSize.left,
            width: editorSize.width
          }
        })
        return
      }
      // if nav is on bottom
      if (editorSize.bottom - navSize < navPosY) {
        this.setState({
          showGuideline: true,
          guidelinePosition: 'bottom',
          guidelineStyles: {
            top: editorSize.bottom,
            left: editorSize.left,
            width: editorSize.width
          }
        })
        return
      }
      // if nav is on left
      if (navPosX < editorSize.left + navSizeSide) {
        this.setState({
          showGuideline: true,
          guidelinePosition: 'left',
          guidelineStyles: {
            top: editorSize.top,
            left: editorSize.left,
            height: editorSize.height
          }
        })
        return
      }
      // if nav is on right
      if (editorSize.right - navSizeSide < navPosX) {
        this.setState({
          showGuideline: true,
          guidelinePosition: 'right',
          guidelineStyles: {
            top: editorSize.top,
            left: editorSize.right,
            height: editorSize.height
          }
        })
        return
      }
    }
    this.setState({
      showGuideline: false
    })
  }

  render () {
    let { guidelinePosition, isDragging, showGuideline, guidelineStyles } = this.state
    let draggingContent = ''
    if (isDragging) {
      let guidelineClasses = [ 'vcv-ui-wpbackend-navbar-guideline', 'vcv-ui-wpbackend-navbar-guideline-' + guidelinePosition ]
      if (showGuideline) {
        guidelineClasses.push('vcv-ui-wpbackend-navbar-guideline-is-visible')
      }
      guidelineClasses = guidelineClasses.join(' ')
      draggingContent = (<div className={guidelineClasses} style={guidelineStyles} />)
    }

    return (
      <div id='vc-navbar-container'>
        {draggingContent}
        <Navbar api={this.props.api} />
      </div>
    )
  }
}
