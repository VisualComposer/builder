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
  get: (id) => {
    let data = services.document.get(id)
    if (data) {
      return new Element(data, services, storages)
    } else {
      return null
    }
  }
}

addService('elementAccessPoint', ElementAPI)
