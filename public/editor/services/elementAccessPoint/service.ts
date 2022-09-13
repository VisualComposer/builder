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
  getInstance: (id:string, elementData:{inner:boolean, innerMultipleLevel:boolean, id:string, tag:string}, elementParentProps:{elementAccessPoint:{inner:boolean}}) => {
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
