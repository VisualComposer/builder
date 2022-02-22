import React, { useState } from 'react'
import { getService, getStorage } from 'vc-cake'
import ControlDropdown from './controlDropdown'
import { ControlHelpers } from './controlHelpers'
import MainControl from './mainControl'

const hubElementsService = getService('hubElements')
const layoutStorage = getStorage('layout')

export default function Control (props) {
  const [activeDropdown, setActiveDropdown] = useState(false)
  const [hoverClasses, setHoverClasses] = useState([])

  const vcElement = ControlHelpers.getVcElement(props.id)
  if (!vcElement) {
    return null
  }
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))
  const activeClass = 'vcv-ui-outline-control-dropdown-active'

  let controlsClasses = [
    'vcv-ui-outline-control-dropdown',
    `vcv-ui-outline-control-type-index-${colorIndex}`,
    hoverClasses.includes(activeClass) ? activeClass : '',
    !props.isDraggable && props.isDraggable !== undefined ? 'vcv-ui-outline-control-dropdown-non-draggable' : ''
  ]

  if (hoverClasses.length) {
    controlsClasses = [...controlsClasses, ...hoverClasses]
  }
  controlsClasses = controlsClasses.join(' ')

  const handleMouseEnter = () => {
    setActiveDropdown(!activeDropdown)
    layoutStorage.state('interactWithControls').set({
      type: 'mouseEnter',
      vcElementId: props.id
    })
    layoutStorage.state('userInteractWith').set(props.id)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(!activeDropdown)
    setHoverClasses([])
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: props.id
    })
    layoutStorage.state('userInteractWith').set(false)
  }

  const handleHover = (classes) => {
    setHoverClasses([...classes, activeClass])
  }

  const controlDropdown = activeDropdown ? <ControlDropdown id={props.id} handleHover={handleHover} /> : null

  return (
    <div
      className={controlsClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MainControl title={title} id={props.id} icon={icon} />
      {controlDropdown}
    </div>
  )
}
