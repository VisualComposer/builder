import React from 'react'
import { getService, getStorage } from 'vc-cake'
import ControlAction from './controlAction'
import { ControlHelpers } from './controlHelpers'

const cook = getService('cook')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default function ControlDropdownInner ({ elementId, isRightClick }) {
  const vcElement = ControlHelpers.getVcElement(elementId)
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)
  const options = ControlHelpers.getDropdownOptions(vcElement, colorIndex)

  const localizations = dataManager.get('localizations')
  const addText = localizations ? localizations.add : 'Add'
  const addElementText = localizations ? localizations.addElement : 'Add Element'
  const cloneText = localizations ? localizations.clone : 'Clone'
  const copyText = localizations ? localizations.copy : 'Copy'
  const pasteText = localizations ? localizations.paste : 'Paste'
  const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
  const removeText = localizations ? localizations.remove : 'Remove'
  const editText = localizations ? localizations.edit : 'Edit'
  const designOptionsText = localizations ? localizations.designOptions : 'Design Options'
  const rowLayoutText = localizations ? localizations.rowLayout : 'Row Layout'
  const cookElement = options && cook.get(options)
  const elementCustomControls = cookElement.get('metaElementControls')

  const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
  const designOptionEvent = options.designOptions

  // prepare actions
  const actions = []

  // add element action
  if (options.isContainer) {
    // tabs don't have advanced design options
    let label = addElementText
    let addElementTag = ''
    const children = cook.getContainerChildren(options.tag)
    if (children.length === 1) {
      addElementTag = children[0].tag
      label = `${addText} ${children[0].name}`
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

  // edit design options control
  if ((isRightClick && !options.isContainer) || options.isContainer) {
    actions.push({
      label: designOptionsText,
      title: `${options.title} ${designOptionsText}`,
      icon: 'vcv-ui-icon-brush-alt',
      data: {
        vcControlEvent: 'edit',
        vcControlEventOptions: designOptionEvent
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
