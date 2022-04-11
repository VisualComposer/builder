import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { getService, getStorage } from 'vc-cake'

const cook = getService('cook')
const documentManager = getService('document')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')

const workspaceSettings = workspaceStorage.state('settings')
const iframe = document.getElementById('vcv-editor-iframe')

function updateAppendContainerPosition (vcElementId, iframeDocument, appendControlContainer) {
  if (!appendControlContainer.current) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  const elementRect = contentElement.getBoundingClientRect()
  const control = appendControlContainer.current.firstElementChild
  let controlPos = 0
  if (control) {
    controlPos = control.getBoundingClientRect()
  }

  let posTop = elementRect.bottom - controlPos.height / 2
  let posLeft = elementRect.left
  if (iframe.tagName.toLowerCase() !== 'iframe') {
    const iframeRect = iframe.getBoundingClientRect()
    posTop -= iframeRect.top
    posLeft -= iframeRect.left
  }
  return {
    top: posTop,
    left: posLeft,
    width: elementRect.width
  }
}

const AppendControl = ({ data = {}, columnResizeData }) => {
  const { vcElementsPath, vcElementId } = data
  const controlContainer = useRef()
  const [containerPos, setContainerPos] = useState(false)
  const [iframeElement, setIframeElement] = useState(document.getElementById('vcv-editor-iframe'))

  const setPositionState = useCallback(() => {
    if (vcElementId) {
      setContainerPos(updateAppendContainerPosition(vcElementId, iframeElement.contentDocument, controlContainer))
    }
  }, [vcElementId])

  // Dependencies are empty because it reacts only on storage state change
  const handleSettingsChange = useCallback(() => {
    setIframeElement(document.getElementById('vcv-editor-iframe'))
  }, [])

  useEffect(() => {
    setPositionState()
    settingsStorage.state('pageTemplate').onChange(handleSettingsChange)
    return () => {
      settingsStorage.state('pageTemplate').ignoreChange(handleSettingsChange)
    }
  }, [setPositionState])

  if (columnResizeData.mode) {
    return null
  }

  const localizations = dataManager.get('localizations')
  const addElementText = localizations ? localizations.addElement : 'Add Element'
  const elementIds = vcElementsPath
  const insertAfterElement = elementIds && elementIds.length ? elementIds[0] : false
  const container = elementIds && elementIds.length > 2 ? elementIds[1] : false
  if (!container || !insertAfterElement) {
    return null
  }

  const containerElement = cook.get(documentManager.get(container))
  if (!containerElement) {
    return null
  }

  const isParentElementLocked = containerElement.get('metaIsElementLocked')
  if (isParentElementLocked) {
    return null
  }

  const isContainerForGeneral = containerElement.containerFor().indexOf('General') > -1
  if (!isContainerForGeneral) {
    return null
  }

  const handleClick = () => {
    const options = {
      insertAfter: insertAfterElement
    }
    const currentState = workspaceSettings.get()
    if (currentState && currentState.action === 'add') {
      workspaceSettings.set(false)
      setTimeout(() => {
        workspaceStorage.trigger('add', containerElement.get('id'), false, options)
      }, 300)
    } else {
      workspaceStorage.trigger('add', containerElement.get('id'), false, options)
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

  return (
    <div className='vcv-ui-append-control-container' ref={controlContainer} style={{ ...styles }}>
      <span className='vcv-ui-append-control' title={addElementText} onClick={handleClick}>
        <i className='vcv-ui-icon vcv-ui-icon-add' />
      </span>
    </div>
  )
}

const mapStateToProps = state => ({
  data: state.controls.appendControlData,
  columnResizeData: state.controls.columnResizeData
})

export default connect(mapStateToProps)(AppendControl)
