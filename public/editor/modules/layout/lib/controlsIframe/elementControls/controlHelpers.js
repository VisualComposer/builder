import { getService } from 'vc-cake'

const cook = getService('cook')
const documentManager = getService('document')

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
  }
}
