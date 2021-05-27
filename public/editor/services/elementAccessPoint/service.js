import { addService, getService, getStorage } from 'vc-cake'
import Element from './element'

const services = {
  document: getService('document'),
  cook: getService('cook')
}

const storages = {
  elements: getStorage('elements')
}

const ElementAPI = {
  getInstance: (id, elementData, elementParentProps) => {
    if (id) {
      elementData = services.document.get(id)
      if (elementData) {
        return new Element(elementData, services, storages)
      }
    } else if (elementData) {
      elementData.inner = true
      if (elementParentProps && elementParentProps.elementAccessPoint.inner) {
        elementData.innerMultipleLevel = true
      }
      return new Element(elementData, services, storages)
    }
    return null
  }
}

addService('elementAccessPoint', ElementAPI)
