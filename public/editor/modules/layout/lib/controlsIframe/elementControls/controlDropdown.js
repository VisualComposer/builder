import React, { useState, useEffect, useRef } from 'react'
import { getService, getStorage } from 'vc-cake'
import { ControlAction } from './controlAction'
import { ControlHelpers } from './controlHelpers'

const cook = getService('cook')
const workspaceStorage = getStorage('workspace')

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
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const addText = localizations ? localizations.add : 'Add'
  const addElementText = localizations ? localizations.addElement : 'Add Element'
  const moveText = localizations ? localizations.move : 'Move'
  const cloneText = localizations ? localizations.clone : 'Clone'
  const copyText = localizations ? localizations.copy : 'Copy'
  const pasteText = localizations ? localizations.paste : 'Paste'
  const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
  const removeText = localizations ? localizations.remove : 'Remove'
  const editText = localizations ? localizations.edit : 'Edit'
  const hideOffText = localizations ? localizations.hideOff : 'Hide: Off'
  const designOptionsText = localizations ? localizations.designOptions : 'Design Options'
  const rowLayoutText = localizations ? localizations.rowLayout : 'Row Layout'
  const designOptionEvent = options.designOptions

  // prepare actions
  const actions = []

  // add move action
  actions.push({
    label: `${moveText} ${options.title}`,
    icon: 'vcv-ui-icon-move',
    data: {
      vcDragHelper: elementId
    }
  })

  // add element action
  if (options.isContainer) {
    // tabs don't have advanced design options
    let label = addElementText
    let addElementTag = ''
    const children = cook.getContainerChildren(options.tag)
    if (children.length === 1) {
      const element = cook.get(children[0])
      label = `${addText} ${element.get('name')}`
      addElementTag = element.get('tag')
    }
    if (options.tag === 'buttonGroup') {
      label = `${addText} Button`
      addElementTag = options.tag
    }
    if (options.tag === 'iconGroup') {
      const element = cook.get({ tag: 'icon' })
      label = `${addText} ${element.get('name')}`
      addElementTag = element.get('tag')
    }
    actions.push({
      label: label,
      icon: 'vcv-ui-icon-add-thin',
      data: {
        vcControlEvent: 'add',
        vcControlEventOptions: addElementTag
      }
    })
  }

  // edit general control
  actions.push({
    label: editText,
    title: `${editText} ${options.title}`,
    icon: 'vcv-ui-icon-edit',
    data: {
      vcControlEvent: 'edit'
    }
  })

  // add controls for row
  if (options.tag === 'row') {
    actions.push({
      label: rowLayoutText,
      icon: 'vcv-ui-icon-row-layout',
      data: {
        vcControlEvent: 'edit',
        vcControlEventOptions: 'layout'
      }
    })
  }

  // edit design options control
  actions.push({
    label: designOptionsText,
    title: `${options.title} ${designOptionsText}`,
    icon: 'vcv-ui-icon-brush-alt',
    data: {
      vcControlEvent: 'edit',
      vcControlEventOptions: designOptionEvent
    }
  })

  // clone control
  actions.push({
    label: cloneText,
    title: `${cloneText} ${options.title}`,
    icon: 'vcv-ui-icon-copy',
    data: {
      vcControlEvent: 'clone'
    }
  })

  // copy action
  actions.push({
    label: copyText,
    title: `${copyText} ${options.title}`,
    icon: 'vcv-ui-icon-copy-icon',
    data: {
      vcControlEvent: 'copy'
    }
  })

  // paste action
  const pasteElCook = options && cook.get(options)
  const pasteElContainerFor = pasteElCook && pasteElCook.get('containerFor')
  const isPasteAvailable = pasteElContainerFor && pasteElContainerFor.value && pasteElContainerFor.value.length

  if (isPasteAvailable) {
    const copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
    const pasteOptions = getPasteOptions(copyData, options)

    actions.push({
      label: pasteOptions.pasteAfter ? pasteAfterText : pasteText,
      disabled: pasteOptions.disabled,
      icon: 'vcv-ui-icon-paste-icon',
      data: {
        vcControlEvent: pasteOptions.pasteAfter ? 'pasteAfter' : 'paste'
      }
    })
  }

  if (options.tag !== 'column') {
    actions.push({
      label: hideOffText,
      title: hideOffText,
      icon: 'vcv-ui-icon-eye-on',
      data: {
        vcControlEvent: 'hide'
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
