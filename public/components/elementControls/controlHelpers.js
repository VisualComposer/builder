import { getService, getStorage } from 'vc-cake'

const cook = getService('cook')
const documentManager = getService('document')
const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')

export const ControlHelpers = {
  getVcElement: function (elementId) {
    return documentManager.get(elementId) && cook.get(documentManager.get(elementId))
  },
  getElementColorIndex: function (vcElement) {
    let colorIndex = 2
    if (vcElement && vcElement.containerFor().length > 0) {
      const isContainerForGeneral = vcElement.containerFor().indexOf('General') > -1
      colorIndex = isContainerForGeneral ? 1 : 0
    }
    return colorIndex
  },
  getPasteOptions: (copyData, pasteEl) => {
    const pasteOptions = {
      disabled: !copyData,
      pasteAfter: false
    }

    if (!copyData) {
      return pasteOptions
    }

    if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        console.error(err)
        return pasteOptions
      }
    }

    const copiedEl = copyData && copyData.element && copyData.element.element
    const copiedElCook = copiedEl && cook.get(copiedEl)
    const copiedElRelatedTo = copiedElCook.get('relatedTo')
    const copiedElRelatedToValue = copiedElRelatedTo && copiedElRelatedTo.value

    const pasteElCook = pasteEl && cook.get(pasteEl)
    const pasteElContainerFor = pasteElCook.get('containerFor')
    const pasteElContainerForValue = pasteElContainerFor && pasteElContainerFor.value

    const editorType = dataManager.get('editorType')
    const layoutType = settingsStorage.state('layoutType').get()

    const copyOptions = copyData && copyData.options
    const isEditorSpecific =
      copyData &&
      copyOptions &&
      copyOptions.editorTypeRelation &&
      copyOptions.editorTypeRelation === 'vcv_layouts' &&
      (editorType !== 'vcv_layouts' ||
        (
          (layoutType === 'archiveTemplate' && copyOptions.elementTag === 'layoutContentArea') ||
          (layoutType === 'postTemplate' && copyOptions.elementTag === 'postsGridDataSourceArchive')
        )
      )

    if (isEditorSpecific) {
      pasteOptions.disabled = true
    } else if (
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
    } else if (!pasteElContainerForValue) {
      pasteOptions.pasteAfter = true
      if (copiedElRelatedToValue.indexOf('General') < 0) {
        pasteOptions.disabled = true
      }
    }

    return pasteOptions
  },
  getDropdownOptions: (vcElement, colorIndex) => {
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
}
