import React from 'react'
import ControlDropdownInner from 'public/components/elementControls/controlDropdownInner'
import { ControlHelpers } from '../elementControls/controlHelpers'
import classNames from 'classnames'

export default class MenuDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownVerticalPosition: 'bottom',
      dropdownHorizontalPosition: 'right'
    }

    this.rightClickDropdown = React.createRef()

    this.setDropdownPosition = this.setDropdownPosition.bind(this)
  }

  componentDidMount () {
    this.setDropdownPosition()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.position !== this.props.position) {
      this.setDropdownPosition()
    }
  }

  setDropdownPosition () {
    const iframe = document.getElementById('vcv-editor-iframe')
    const dropdownRect = this.rightClickDropdown.current.getBoundingClientRect()

    if (this.props.position.left + dropdownRect.width > iframe.contentWindow.innerWidth) {
      this.setState({
        dropdownHorizontalPosition: 'left'
      })
    } else {
      this.setState({
        dropdownHorizontalPosition: 'right'
      })
    }

    if (this.props.position.top + dropdownRect.height > iframe.contentWindow.innerHeight) {
      this.setState({
        dropdownVerticalPosition: 'top'
      })
    } else {
      this.setState({
        dropdownVerticalPosition: 'bottom'
      })
    }
  }

  render () {
    const vcElement = ControlHelpers.getVcElement(this.props.id)
    const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
    const isRightClick = true

    if (!vcElement) {
      return null
    }

    const styles = {
      left: this.props.position.left + 'px',
      top: this.props.position.top + 'px'
    }

    const dropdownClasses = classNames({
      'vcv-ui-right-click-menu-dropdown-content': true,
      [`vcv-ui-right-click-menu-dropdown-index-${colorIndex}`]: true,
      [`vcv-ui-right-click-menu-dropdown-position--${this.state.dropdownVerticalPosition}`]: true,
      [`vcv-ui-right-click-menu-dropdown-position--${this.state.dropdownHorizontalPosition}`]: true
    })

    return (
      <div className='vcv-ui-right-click-menu-container' style={styles}>
        <div className={dropdownClasses} ref={this.rightClickDropdown}>
          <ControlDropdownInner elementId={this.props.id} isCenterControls={false} isRightClick={isRightClick} />
        </div>
      </div>
    )
  }
}
