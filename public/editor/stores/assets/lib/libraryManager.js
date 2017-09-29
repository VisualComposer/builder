import {getStorage} from 'vc-cake'
const assets = getStorage('assets')

export default class LibraryManager {
  add (id, data) {
    let storageState = assets.state('jsLibs')
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    let element = {
      id: id,
      element: data
    }
    stateElements.push(element)
    storageState.set({ elements: stateElements })
  }

  edit (id, data) {
    let storageState = assets.state('jsLibs')
    let stateElements = storageState.get()
    let elementIndex = stateElements.elements.findIndex((element) => {
      return element.id === id
    })
    stateElements.elements[elementIndex] = data
  }

  remove (id) {
    let storageState = assets.state('jsLibs')
    let stateElements = storageState.get()
    if (stateElements && stateElements.elements) {
      let newElements = stateElements.elements.filter((element) => {
        return element.id !== id
      })
      storageState.set({ elements: newElements })
    }
  }
}
