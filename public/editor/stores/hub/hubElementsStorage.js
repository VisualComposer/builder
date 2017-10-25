import { addStorage } from 'vc-cake'
import $ from 'jquery'

addStorage('hubElements', (storage) => {
  storage.on('start', () => {
    storage.state('elements').set(window.VCV_HUB_GET_ELEMENTS())
  })

  storage.on('add', (elementData, addBundle) => {
    let elements = storage.state('elements').get() || {}
    elements[ elementData.tag ] = elementData
    storage.state('elements').set(elements)
    if (addBundle) {
      Promise.all([ $.getScript(elementData.bundlePath) ])
    }
  })
})
