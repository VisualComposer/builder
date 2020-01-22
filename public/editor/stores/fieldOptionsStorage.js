import { addStorage } from 'vc-cake'
addStorage('fieldOptions', (storage) => {
  storage.on('setElementInitialValue', (elementTag, attrKey, value) => {
    const elementValues = storage.state('elementInitialValue').get() || {}

    if (elementValues[elementTag]) {
      elementValues[elementTag][attrKey] = value
    } else {
      elementValues[elementTag] = {
        [attrKey]: value
      }
    }

    storage.state('elementInitialValue').set(elementValues)
  })
})
