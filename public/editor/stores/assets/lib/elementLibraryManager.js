import { getStorage } from 'vc-cake'
const assets = getStorage('assets')
const storageState = assets.state('jsLibs')

export default class ElementLibraryManager {
  add (element, library) {
    const id = element.get('id')
    const stateElements = storageState.get().elements
    const stateElementIndex = stateElements.findIndex((element) => {
      return element.id === id
    })
    if (stateElementIndex < 0) {
      return
    }
    const elementData = stateElements[ stateElementIndex ]
    elementData.elementLibraries = elementData.elementLibraries || []
    elementData.elementLibraries.push(library)
    storageState.set({ elements: stateElements })
  }

  remove (element, library) {
    const id = element.get('id')
    const stateElements = storageState.get().elements
    const stateElementIndex = stateElements.findIndex((element) => {
      return element.id === id
    })
    if (stateElementIndex < 0) {
      return
    }
    const elementData = stateElements[ stateElementIndex ]

    if (elementData.elementLibraries && elementData.elementLibraries.length) {
      elementData.elementLibraries = elementData.elementLibraries.filter((currentLib) => {
        return currentLib.name !== library.name
      })
      storageState.set({ elements: stateElements })
    }
  }
}
