import React, { useState, useEffect, useRef } from 'react'
import { getStorage } from 'vc-cake'
import ControlDropdownInner from './controlDropdownInner'

const layoutStorage = getStorage('layout')

const layoutContent = document.querySelector('.vcv-layout-content')

const getControlDropdownPosition = (control) => {
  if (!control.current) {
    return false
  }
  const layoutContentRect = layoutContent.getBoundingClientRect()
  const dropdownPos = control.current.getBoundingClientRect()
  const position = []
  // drop up
  if (dropdownPos.top + dropdownPos.height > layoutContentRect.top + layoutContentRect.height) {
    position.push('vcv-ui-outline-control-dropdown-o-drop-up')
  }
  // drop right
  if (dropdownPos.left + dropdownPos.width > layoutContentRect.left + layoutContentRect.width) {
    position.push('vcv-ui-outline-control-dropdown-o-drop-right')
  }

  return position
}

export default function ControlDropdown (props) {
  const {handleHoverOut} = props
  const dropdown = useRef()
  const [dropdownPos, setDropdownPos] = useState(false)

  useEffect(() => {
    if (!dropdownPos) {
      const position = getControlDropdownPosition(dropdown)
      setDropdownPos(position)
      props.handleHover(position)
    }
  }, [setDropdownPos, dropdownPos, props])

  useEffect(() => {
    return () => {
      handleHoverOut()
    }
  }, [handleHoverOut])

  const handleMouseEnter = () => {
    const hideControlsInterval = layoutStorage.state('hideControlsInterval').get()
    if (hideControlsInterval) {
      clearInterval(hideControlsInterval)
      layoutStorage.state('hideControlsInterval').set(false)
    }
  }

  return (
    <div className='vcv-ui-outline-control-dropdown-content' ref={dropdown} onMouseEnter={handleMouseEnter}>
      <ControlDropdownInner elementId={props.id} />
    </div>
  )
}
