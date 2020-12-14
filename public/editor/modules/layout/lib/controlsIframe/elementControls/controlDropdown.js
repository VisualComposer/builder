import React, { useState, useEffect, useRef } from 'react'
import { getService, getStorage } from 'vc-cake'
import { ControlAction } from './controlAction'
import { ControlHelpers } from './controlHelpers'

const cook = getService('cook')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')

const iframe = document.getElementById('vcv-editor-iframe')

function updateControlDropdownPosition (control) {
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

function getDropdownOptions (vcElement, colorIndex) {
  return {
    isContainer: colorIndex < 2,
    title: vcElement.get('customHeaderTitle') || vcElement.get('name'),
    name: vcElement.get('name'),
    tag: vcElement.get('tag'),
    relatedTo: vcElement.get('relatedTo'),
    designOptions: vcElement.get('designOptions') ? 'designOptions' : 'designOptionsAdvanced',
    containerFor: vcElement.get('containerFor')
  }
}

function getPasteOptions (copyData, pasteEl) {
  const pasteOptions = {
    disabled: !copyData,
    pasteAfter: false
  }

  if (!copyData || copyData.constructor !== String) {
    return pasteOptions
  }

  try {
    copyData = JSON.parse(copyData)
  } catch (err) {
    console.error(err)
    return pasteOptions
  }

  const copiedEl = copyData && copyData.element && copyData.element.element
  const copiedElCook = copiedEl && cook.get(copiedEl)
  const copiedElRelatedTo = copiedElCook.get('relatedTo')
  const copiedElRelatedToValue = copiedElRelatedTo && copiedElRelatedTo.value

  const pasteElCook = pasteEl && cook.get(pasteEl)
  const pasteElContainerFor = pasteElCook.get('containerFor')
  const pasteElContainerForValue = pasteElContainerFor && pasteElContainerFor.value

  if (
    copiedElRelatedToValue &&
    pasteElContainerForValue &&
    copiedElRelatedToValue.length &&
    pasteElContainerForValue.length
  ) {
    if (pasteElContainerForValue.indexOf('General') < 0 || copiedElRelatedToValue.indexOf('General') < 0) {
      pasteOptions.disabled = true

      pasteElContainerForValue.forEach((item) => {
        if (copiedElRelatedToValue.indexOf(item) >= 0) {
          pasteOptions.disabled = false
        }
      })
    }

    if (pasteOptions.disabled && pasteElContainerForValue.indexOf('General') < 0) {
      if (pasteElCook.get('tag') === copiedElCook.get('tag')) {
        pasteOptions.disabled = false
        pasteOptions.pasteAfter = true
      }
    }
  }

  return pasteOptions
}

function getControlDropdown (elementId, options) {
  const localizations = dataManager.get('localizations')
  const cloneText = localizations ? localizations.clone : 'Clone'
  const copyText = localizations ? localizations.copy : 'Copy'
  const pasteText = localizations ? localizations.paste : 'Paste'
  const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
  const removeText = localizations ? localizations.remove : 'Remove'
  const editText = localizations ? localizations.edit : 'Edit'
  const cookElement = options && cook.get(options)
  const elementCustomControls = cookElement.get('metaElementControls')

  // prepare actions
  const actions = []

  // edit general control
  actions.push({
    label: editText,
    title: `${editText} ${options.title}`,
    icon: 'vcv-ui-icon-edit',
    data: {
      vcControlEvent: 'edit'
    }
  })

  if (!elementCustomControls || elementCustomControls.clone !== false) {
    // clone control
    actions.push({
      label: cloneText,
      title: `${cloneText} ${options.title}`,
      icon: 'vcv-ui-icon-copy',
      data: {
        vcControlEvent: 'clone'
      }
    })
  }

  if (!elementCustomControls || elementCustomControls.copy !== false) {
    // copy action
    actions.push({
      label: copyText,
      title: `${copyText} ${options.title}`,
      icon: 'vcv-ui-icon-copy-icon',
      data: {
        vcControlEvent: 'copy'
      }
    })
  }

  // paste action
  const pasteElContainerFor = cookElement && cookElement.get('containerFor')
  const isPasteAvailable = pasteElContainerFor && pasteElContainerFor.value && pasteElContainerFor.value.length

  if (isPasteAvailable) {
    const copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
    const pasteOptions = getPasteOptions(copyData, options)

    if (!pasteOptions.disabled) {
      if (elementCustomControls && (elementCustomControls.pasteAfter === false && pasteOptions.pasteAfter)) {
        pasteOptions.disabled = true
      }
    }

    actions.push({
      label: pasteOptions.pasteAfter ? pasteAfterText : pasteText,
      disabled: pasteOptions.disabled,
      icon: 'vcv-ui-icon-paste-icon',
      data: {
        vcControlEvent: pasteOptions.pasteAfter ? 'pasteAfter' : 'paste'
      }
    })
  }

  // remove control
  actions.push({
    label: removeText,
    title: `${removeText} ${options.title}`,
    icon: 'vcv-ui-icon-trash',
    data: {
      vcControlEvent: 'remove'
    }
  })

  return actions.map((actionOptions, i) => {
    return <ControlAction key={`dropdown-control-${i}`} id={elementId} options={actionOptions} />
  })
}

export function ControlDropdown (props) {
  const dropdown = useRef()
  const [dropdownPos, setDropdownPos] = useState(false)

  const vcElement = ControlHelpers.getVcElement(props.id)
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const dropdownOptions = getDropdownOptions(vcElement, colorIndex)

  useEffect(() => {
    if (!dropdownPos) {
      const position = updateControlDropdownPosition(dropdown)
      setDropdownPos(position)
      props.handleHover(position)
    }
  })

  return (
    <div className='vcv-ui-outline-control-dropdown-content' ref={dropdown}>
      {getControlDropdown(props.id, dropdownOptions)}
    </div>
  )
}
