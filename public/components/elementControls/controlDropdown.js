import React, { useState, useEffect, useRef } from 'react'
import { getStorage } from 'vc-cake'
import ControlDropdownInner from './controlDropdownInner'

const layoutStorage = getStorage('layout')

const iframe = document.getElementById('vcv-editor-iframe')

const getControlDropdownPosition = (control) => {
  if (!control.current) {
    return false
  }
  const iframeRect = iframe.getBoundingClientRect()
  const dropdownPos = control.current.getBoundingClientRect()
  const position = []
  // drop up
  if (dropdownPos.top + dropdownPos.height > iframeRect.top + iframeRect.height) {
    position.push('vcv-ui-outline-control-dropdown-o-drop-up')
  }
  // drop right
  if (dropdownPos.left + dropdownPos.width > iframeRect.left + iframeRect.width) {
    position.push('vcv-ui-outline-control-dropdown-o-drop-right')
  }

  return position
}

export default function ControlDropdown (props) {
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
      props.handleHoverOut()
    }
  }, [])

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
