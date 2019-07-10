import React, { useState, useEffect, useRef } from 'react'
import { getService, getStorage } from 'vc-cake'
import { exceptionalElements } from './../exceptionalElements'

const cook = getService('cook')
const documentManager = getService('document')
const workspaceStorage = getStorage('workspace')

const iframe = document.getElementById('vcv-editor-iframe')

function updateAppendContainerPosition (data, appendControlContainer) {
  if (!appendControlContainer.current) {
    return false
  }
  const elementRect = data.element.getBoundingClientRect()
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

export function AppendControl (props) {
  const controlContainer = useRef()
  const [ containerPos, setContainerPos ] = useState(updateAppendContainerPosition(props.data, controlContainer))

  useEffect(() => {
    if (!containerPos) {
      setContainerPos(updateAppendContainerPosition(props.data, controlContainer))
    }
  })

  const localizations = window.VCV_I18N && window.VCV_I18N()
  const addElementText = localizations ? localizations.addElement : 'Add Element'
  const elementIds = props.data.vcElementsPath
  const insertAfterElement = elementIds && elementIds.length ? elementIds[ 0 ] : false
  const container = elementIds && elementIds.length > 2 ? elementIds[ 1 ] : false
  if (!container || !insertAfterElement) {
    return null
  }
  const containerElement = cook.get(documentManager.get(container))
  if (!containerElement || !containerElement.relatedTo([ exceptionalElements ])) {
    return null
  }

  const handleClick = () => {
    const options = {
      insertAfter: insertAfterElement
    }
    workspaceStorage.trigger('add', containerElement.get('id'), false, options)
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
