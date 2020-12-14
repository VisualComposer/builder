import React, { useState, useEffect, useRef } from 'react'
import { getStorage, getService } from 'vc-cake'
import { Control } from './control'
import { ControlAction } from './controlAction'

const layoutStorage = getStorage('layout')
const iframe = document.getElementById('vcv-editor-iframe')
const dataManager = getService('dataManager')

function updateContainerPosition (data, controlsContainer) {
  if (!controlsContainer.current) {
    return false
  }
  const elementRect = data.element.getBoundingClientRect()
  const controls = controlsContainer.current.firstElementChild
  let controlsHeight = 0
  if (controls) {
    controlsHeight = controls.getBoundingClientRect().height
  }
  const position = {}
  // set sticky controls
  position.top = elementRect.top
  if (position.top - controlsHeight < 0) {
    controlsContainer.current.classList.add('vcv-ui-controls-o-inset')
    position.top = controlsHeight
  } else {
    controlsContainer.current.classList.remove('vcv-ui-controls-o-inset')
  }
  position.left = elementRect.left
  if (iframe.tagName.toLowerCase() !== 'iframe') {
    const iframeRect = iframe.getBoundingClientRect()
    position.top -= iframeRect.top
    position.left -= iframeRect.left
  }
  if (position.left < 0) {
    position.left = 0
  }

  position.width = elementRect.width

  return position
}

function updateControlsPosition (data, controlsContainer) {
  if (!controlsContainer.current) {
    return false
  }
  const elementRect = data.element.getBoundingClientRect()
  const controlsList = controlsContainer.current.querySelector('.vcv-ui-outline-controls')
  const controlsListPos = controlsList.getBoundingClientRect()
  const iframeRect = iframe.getBoundingClientRect()
  return elementRect.left + controlsListPos.width > iframeRect.width
}

function getVisibleControls (elementIds, controls) {
  controls = controls.current
  if (!controls) {
    return false
  }
  const controlsRect = controls.getBoundingClientRect()
  const controlsDropdown = controls.querySelector('.vcv-ui-outline-control-dropdown')
  if (!controlsDropdown) {
    return false
  }
  const controlWidth = controlsDropdown.getBoundingClientRect().width
  const iframeRect = iframe.getBoundingClientRect()
  const isWider = iframeRect.width - controlsRect.width < controlWidth
  if (isWider) {
    const difference = Math.abs(iframeRect.width - controlsRect.width)
    const elementsOverlap = Math.ceil(difference / controlWidth)
    elementIds.splice(elementIds.length - elementsOverlap)
    return elementIds
  }

  return false
}

function getControls (data, visibleControls) {
  const { vcvDraggableIds, vcvEditableElements } = data
  const controls = []
  const iterableControls = visibleControls || vcvEditableElements
  const localizations = dataManager.get('localizations')
  iterableControls.forEach((id, i) => {
    if (i === iterableControls.length - 1 && visibleControls) {
      const treeViewText = localizations ? localizations.treeView : 'Tree View'
      const options = {
        title: treeViewText,
        icon: 'vcv-ui-icon-layers',
        classes: 'vcv-ui-outline-control-more',
        data: {
          vcControlEvent: 'treeView'
        }
      }
      controls.push(<ControlAction id={id} options={options} key={`element-control-tree-view-${id}`} />)
    } else {
      controls.push(<Control id={id} key={`element-control-${id}`} isDraggable={vcvDraggableIds.includes(id)} />)
    }
    if (i < vcvEditableElements.length - 1) {
      controls.push(
        <i className='vcv-ui-outline-control-separator vcv-ui-icon vcv-ui-icon-arrow-right' key={`element-delimiter-${id}-${i}`} />)
    }
  })

  return controls.reverse()
}

export function Controls (props) {
  const controlsContainer = useRef()
  const controls = useRef()
  const { vcvEditableElements } = props.data
  const [containerPos, setContainerPos] = useState(updateContainerPosition(props.data, controlsContainer))
  const [controlsPos, setControlsPos] = useState(updateControlsPosition(props.data, controlsContainer))
  const [visibleControls, setVisibleControls] = useState(false)

  useEffect(() => {
    if (!containerPos) {
      setContainerPos(updateContainerPosition(props.data, controlsContainer))
    }
    setControlsPos(updateControlsPosition(props.data, controlsContainer))
    if (!visibleControls) {
      setVisibleControls(getVisibleControls(vcvEditableElements, controls))
    }
  })

  const handleMouseEnter = () => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseEnterContainer',
      vcElementId: props.data.vcElementId
    })
  }

  const handleMouseLeave = (e) => {
    // Check if mouse is leaving from container
    // Don't call if mouse leaving from dropdown (still needs to show controls)
    if (!e.target.closest('.vcv-ui-outline-control-dropdown-content')) {
      layoutStorage.state('interactWithControls').set({
        type: 'mouseLeaveContainer',
        vcElementId: props.data.vcElementId
      })
    }
  }

  let styles = {}
  if (containerPos) {
    styles = {
      top: `${containerPos.top}px`,
      left: `${containerPos.left}px`,
      width: `${containerPos.width}px`
    }
  }

  let containerClasses = [
    'vcv-ui-outline-controls-container',
    controlsPos ? 'vcv-ui-controls-o-controls-right' : ''
  ]

  containerClasses = containerClasses.join(' ')

  return (
    <div className={containerClasses} ref={controlsContainer} style={{ ...styles }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <nav className='vcv-ui-outline-controls' ref={controls}>
        {getControls(props.data, visibleControls)}
      </nav>
    </div>
  )
}
