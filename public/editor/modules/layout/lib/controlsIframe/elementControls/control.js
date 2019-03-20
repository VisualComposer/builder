import React, { useState } from 'react'
import { getService, getStorage, setData } from 'vc-cake'
import { ControlDropdown } from './controlDropdown'
import { ControlHelpers } from './controlHelpers'

const hubCategoriesService = getService('hubCategories')
const layoutStorage = getStorage('layout')

export function Control (props) {
  const [ activeDropdown, setActiveDropdown ] = useState(false)
  const [ hoverClasses, setHoverClasses ] = useState([])

  const vcElement = ControlHelpers.getVcElement(props.id)
  if (!vcElement) {
    return null
  }
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const icon = hubCategoriesService.getElementIcon(vcElement.get('tag'))
  const activeClass = 'vcv-ui-outline-control-dropdown-active'

  let controlsClasses = [
    'vcv-ui-outline-control-dropdown',
    `vcv-ui-outline-control-type-index-${colorIndex}`,
    hoverClasses.includes(activeClass) ? activeClass : ''
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

  const handleMouseDown = (e) => {
    e && e.preventDefault()
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: props.id
    })
    setData('draggingElement', { id: props.id, point: { x: e.clientX, y: e.clientY } })
  }

  const controlDropdown = activeDropdown ? <ControlDropdown id={props.id} handleHover={handleHover} /> : null

  return (
    <div className={controlsClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className='vcv-ui-outline-control-dropdown-trigger vcv-ui-outline-control'
        title={title}
        data-vcv-element-id={props.id}
        onMouseDown={handleMouseDown}
      >
        <span className='vcv-ui-outline-control-content'>
          <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
        </span>
      </div>
      {controlDropdown}
    </div>
  )
}
