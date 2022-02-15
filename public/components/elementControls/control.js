import React, { useState } from 'react'
import { getService, getStorage, setData } from 'vc-cake'
import ControlDropdown from './controlDropdown'
import { ControlHelpers } from './controlHelpers'

const hubElementsService = getService('hubElements')
const layoutStorage = getStorage('layout')

let clickState = 'mouseUp'
let mouseDownTimeout = false

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

  const startDrag = (e) => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: props.id
    })
    const layoutContent = document.querySelector('.vcv-layout-content')
    setData('draggingElement', { id: props.id, point: { x: e.clientX - layoutContent.offsetLeft, y: e.clientY - layoutContent.offsetTop } })
    window.clearTimeout(mouseDownTimeout)
    mouseDownTimeout = false
  }

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

  const handleMouseUp = (e) => {
    e && e.preventDefault()
    clickState = 'mouseUp'
    window.clearTimeout(mouseDownTimeout)
    mouseDownTimeout = false
  }

  const handleMouseDown = (e) => {
    e && e.preventDefault()
    clickState = 'mouseDown'
    // will remove the synthetic event from the pool and allow references to the event to be retained by user code.
    // because of setTimeout
    // https://reactjs.org/docs/events.html#event-pooling
    e.persist()
    mouseDownTimeout = setTimeout(() => {
      if (clickState === 'mouseDown') {
        startDrag(e)
      }
    }, 200)
  }

  const controlDropdown = activeDropdown ? <ControlDropdown id={props.id} handleHover={handleHover} /> : null

  return (!props.hide ?
    <div
      className={controlsClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className='vcv-ui-outline-control-dropdown-trigger vcv-ui-outline-control'
        title={title}
        data-vcv-element-id={props.id}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span className='vcv-ui-outline-control-content'>
          <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
        </span>
      </div>
      {controlDropdown}
    </div> : null
  )
}
