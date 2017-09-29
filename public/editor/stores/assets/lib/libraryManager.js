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
}
