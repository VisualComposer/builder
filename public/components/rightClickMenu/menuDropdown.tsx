import React, { useState, useRef, useEffect, useCallback } from 'react'
import ControlDropdownInner from '../elementControls/controlDropdownInner'
import { ControlHelpers } from '../elementControls/controlHelpers'
import classNames from 'classnames'

interface MenuDropdownProps {
  position: {
    top: number,
      left: number
  },
  id: string
}

const MenuDropdown = ({ position, id }: MenuDropdownProps) => {
  const [dropdownVerticalPosition, setDropdownVerticalPosition] = useState('bottom')
  const [dropdownHorizontalPosition, setDropdownHorizontalPosition] = useState('right')
  const rightClickDropdown = useRef<HTMLDivElement>(null)

  const setDropdownPosition = useCallback(() => {
    const iframe = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
    const dropdownRect = rightClickDropdown.current && rightClickDropdown.current.getBoundingClientRect()

    if (dropdownRect && iframe.contentWindow) {
      const isLeft = position.left + dropdownRect.width > iframe.contentWindow.innerWidth
      const isTop = position.top + dropdownRect.height > iframe.contentWindow.innerHeight
      const horizontalPosition = isLeft ? 'left' : 'right'
      const verticalPosition = isTop ? 'top' : 'bottom'
      setDropdownHorizontalPosition(horizontalPosition)
      setDropdownVerticalPosition(verticalPosition)
    }
  }, [rightClickDropdown, position])

  useEffect(() => {
    setDropdownPosition()
  }, [setDropdownPosition])

  const vcElement = ControlHelpers.getVcElement(id)
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const isRightClick = true

  if (!vcElement) {
    return null
  }

  const styles = {
    left: position.left + 'px',
    top: position.top + 'px'
  }

  const dropdownClasses = classNames({
    'vcv-ui-right-click-menu-dropdown-content': true,
    [`vcv-ui-right-click-menu-dropdown-index-${colorIndex}`]: true,
    [`vcv-ui-right-click-menu-dropdown-position--${dropdownVerticalPosition}`]: true,
    [`vcv-ui-right-click-menu-dropdown-position--${dropdownHorizontalPosition}`]: true
  })

  return (
    <div className='vcv-ui-right-click-menu-container' style={styles}>
      <div className={dropdownClasses} ref={rightClickDropdown}>
        <ControlDropdownInner elementId={id} isCenterControls={false} isRightClick={isRightClick} />
      </div>
    </div>
  )
}

export default MenuDropdown
