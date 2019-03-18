import { getService } from 'vc-cake'
import { exceptionalElements } from './../exceptionalElements'

const cook = getService('cook')
const documentManager = getService('document')

export const ControlHelpers = {
  getVcElement: function (elementId) {
    return cook.get(documentManager.get(elementId))
  },
  getElementColorIndex: function (vcElement) {
    let colorIndex = 2
    if (vcElement && vcElement.containerFor().length > 0) {
      const isColoredElement = exceptionalElements.find(element => vcElement.containerFor().indexOf(element) > -1)
      colorIndex = isColoredElement ? 0 : 1
    }
    return colorIndex
  }
}
