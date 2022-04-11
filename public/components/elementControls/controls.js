import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Control from './control'
import ControlAction from './controlAction'
import CenterControls from './centerControls'
import { ControlHelpers } from './controlHelpers'

const layoutStorage = getStorage('layout')
const elementsStorage = getStorage('elements')
const settingsStorage = getStorage('settings')
const iframe = document.getElementById('vcv-editor-iframe')
const dataManager = getService('dataManager')

const getContainerPosition = (vcElementId, iframeDocument, controlsContainer) => {
  if (!controlsContainer.current) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  const elementRect = contentElement.getBoundingClientRect()
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
  } else if (position.top === 0 && controlsHeight === 0) {
    position.top = 43
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
  position.height = elementRect.height
  position.realTop = elementRect.top
  position.bottom = elementRect.bottom

  return position
}

const getControlsPosition = (vcElementId, iframeDocument, controlsContainer) => {
  if (!controlsContainer.current) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  const elementRect = contentElement.getBoundingClientRect()
  const controlsList = controlsContainer.current.querySelector('.vcv-ui-outline-controls')
  const controlsListPos = controlsList.getBoundingClientRect()
  const iframeRect = iframe.getBoundingClientRect()
  return {
    isControlsRight: elementRect.left + controlsListPos.width > iframeRect.width,
    controlsListWidth: controlsListPos.width
  }
}

const getVisibleControls = (elementIds, controls) => {
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
    const elementIdsCopy = [...elementIds]
    elementIdsCopy.splice(elementIdsCopy.length - elementsOverlap)
    return elementIdsCopy
  }

  return false
}

function ControlItems (props) {
  const { visibleControls, vcvDraggableIds, vcvEditableElements } = props
  const controls = []
  const allControls = [...vcvEditableElements]
  const iterableControls = visibleControls || allControls
  const copiedControls = [...iterableControls]
  const localizations = dataManager.get('localizations')
  const firstElement = ControlHelpers.getVcElement(copiedControls[0])
  if (firstElement && firstElement.containerFor().length < 1) {
    copiedControls.splice(0, 1)
    allControls.splice(0, 1)
  }
  copiedControls.forEach((id, i) => {
    if (i === copiedControls.length - 1 && visibleControls) {
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
    if (i < allControls.length - 1) {
      controls.push(
        <i className='vcv-ui-outline-control-separator vcv-ui-icon vcv-ui-icon-arrow-right' key={`element-delimiter-${id}-${i}`} />)
    }
  })

  return controls.reverse()
}

const Controls = ({ data = {}, columnResizeData }) => {
  const controlsContainer = useRef()
  const controls = useRef()
  const { vcvEditableElements, vcElementId, vcvDraggableIds } = data

  const [containerPos, setContainerPos] = useState({
    top: '',
    left: '',
    bottom: '',
    width: '',
    height: '',
    realTop: ''
  })
  const [controlsPos, setControlsPos] = useState(false)
  const [visibleControls, setVisibleControls] = useState(false)
  const [visibleElement, setVisibleElement] = useState(vcElementId)
  const [iframeElement, setIframeElement] = useState(document.getElementById('vcv-editor-iframe'))

  const setPositionState = useCallback(() => {
    if (vcElementId) {
      setContainerPos(getContainerPosition(vcElementId, iframeElement.contentDocument, controlsContainer))
      setControlsPos(getControlsPosition(vcElementId, iframeElement.contentDocument, controlsContainer))
    }
    if (vcvEditableElements) {
      setVisibleControls(getVisibleControls(vcvEditableElements, controls))
    }
  }, [vcElementId, vcvEditableElements])

  const handleElementRemove = useCallback((data) => {
    if (vcvEditableElements && vcvEditableElements.includes(data)) {
      setVisibleElement(false)
    }
  }, [vcElementId])

  // Dependencies are empty because it reacts only on storage state change
  const handleSettingsChange = useCallback(() => {
    setIframeElement(document.getElementById('vcv-editor-iframe'))
  }, [])

  useEffect(() => {
    if (vcElementId) {
      setVisibleElement(vcElementId)
    }
    // Timeout is required because in the getControlsPosition function sometimes
    // the .vcv-ui-outline-controls element has no size, thus failing to calculate proper position.
    const timeout = setTimeout(() => {
      setPositionState()
    }, 0)
    elementsStorage.on('remove', handleElementRemove)
    settingsStorage.state('pageTemplate').onChange(handleSettingsChange)
    return () => {
      elementsStorage.off('remove', handleElementRemove)
      settingsStorage.state('pageTemplate').ignoreChange(handleSettingsChange)
      clearTimeout(timeout)
    }
  }, [setPositionState])

  const handleMouseEnter = () => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseEnterContainer',
      vcElementId: vcElementId
    })
    const hideControlsInterval = layoutStorage.state('hideControlsInterval').get()
    if (hideControlsInterval) {
      clearInterval(hideControlsInterval)
      layoutStorage.state('hideControlsInterval').set(false)
    }
  }

  const handleMouseLeave = (e) => {
    // Check if mouse is leaving from container
    // Don't call if mouse leaving from dropdown (still needs to show controls)
    if (!e.target.closest('.vcv-ui-outline-control-dropdown-content')) {
      layoutStorage.state('interactWithControls').set({
        type: 'mouseLeaveContainer',
        vcElementId: vcElementId
      })
    }
  }

  let styles = {}
  if (containerPos) {
    styles = {
      top: containerPos.top ? `${containerPos.top}px` : '',
      left: containerPos.left ? `${containerPos.left}px` : '',
      width: containerPos.width ? `${containerPos.width}px` : ''
    }
  }

  const isVisible = vcElementId && vcvEditableElements && vcvEditableElements.includes(visibleElement) && !columnResizeData?.mode
  const containerClasses = classNames({
    'vcv-ui-outline-controls-container': true,
    'vcv-ui-controls-o-controls-right': controlsPos?.isControlsRight,
    'vcv-ui-outline-controls-container--is-visible': isVisible
  })

  let centerControls = null
  if (vcvEditableElements && isVisible) {
    const firstElement = ControlHelpers.getVcElement(vcvEditableElements[0])
    if (firstElement && firstElement.containerFor().length < 1) {
      centerControls = (
        <CenterControls
          id={vcvEditableElements[0]}
          containerPos={containerPos}
          controlsListWidth={controlsPos?.controlsListWidth || 0}
          iframeWindow={iframe.contentWindow}
        />
      )
    }
  }

  return (
    <>
      <div className={containerClasses} ref={controlsContainer} style={{ ...styles }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <nav className='vcv-ui-outline-controls' ref={controls}>
          {vcvEditableElements ? (
            <ControlItems
              vcvDraggableIds={vcvDraggableIds}
              visibleControls={visibleControls}
              vcvEditableElements={vcvEditableElements}
            />
          ) : null}
        </nav>
      </div>
      {centerControls}
    </>
  )
}

const mapStateToProps = state => ({
  data: state.controls.controlsData,
  columnResizeData: state.controls.columnResizeData
})

export default connect(mapStateToProps)(Controls)
