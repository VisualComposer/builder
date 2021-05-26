import React from 'react'
import { getService, getStorage } from 'vc-cake'
import ControlAction from './controlAction'
import { ControlHelpers } from './controlHelpers'

const cook = getService('cook')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default function ControlDropdownInner ({ elementId }) {
  const vcElement = ControlHelpers.getVcElement(elementId)
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const options = ControlHelpers.getDropdownOptions(vcElement, colorIndex)

  const localizations = dataManager.get('localizations')
  const cloneText = localizations ? localizations.clone : 'Clone'
  const copyText = localizations ? localizations.copy : 'Copy'
  const pasteText = localizations ? localizations.paste : 'Paste'
  const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
  const removeText = localizations ? localizations.remove : 'Remove'
  const editText = localizations ? localizations.edit : 'Edit'
  const cookElement = options && cook.get(options)
  const elementCustomControls = cookElement.get('metaElementControls')

  const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())

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

  if ((!elementCustomControls || elementCustomControls.clone !== false) && isAbleToAdd) {
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

  if ((!elementCustomControls || elementCustomControls.copy !== false) && isAbleToAdd) {
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

  if (isPasteAvailable && isAbleToAdd) {
    const copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
    const pasteOptions = ControlHelpers.getPasteOptions(copyData, options)

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
