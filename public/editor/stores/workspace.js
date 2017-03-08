import {addStorage, getService} from 'vc-cake'

addStorage('workspace', (storage) => {
  const documentManger = getService('document')
  const cook = getService('cook')
  storage.on('add', (elementId, tag, options) => {
    let element = false
    if (elementId) {
      element = cook.get(documentManger.get(elementId))
    }
    storage.state('settings').set({
      action: 'add',
      element: element,
      tag: tag,
      options: options
    })
  })
  storage.on('edit', (elementId, tag, options) => {
    if (!elementId) {
      return
    }
    const element = cook.get(documentManger.get(elementId))
    if (!element) {
      return
    }
    storage.state('settings').set({
      action: 'edit',
      element: element,
      tag: tag,
      options: options
    })
  })
})
