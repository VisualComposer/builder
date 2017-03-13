import {addStorage, getService, getStorage} from 'vc-cake'

addStorage('workspace', (storage) => {
  const elementsStorage = getStorage('elements')
  const documentManger = getService('document')
  storage.on('add', (id, tag, options) => {
    let element = false
    if (id) {
      element = documentManger.get(id)
    }
    storage.state('settings').set({
      action: 'add',
      element: element,
      tag: tag,
      options: options
    })
  })
  storage.on('edit', (id, tag, options) => {
    if (!id) {
      return
    }
    const element = documentManger.get(id)
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
  storage.on('remove', (id) => {
    const settings = storage.state('settings').get()
    if (settings && settings.action === 'edit') {
      storage.state('settings').set({})
    }
    if (settings && settings.action === 'add' && settings.element && settings.element.id === id) {
      storage.state('settings').set({})
    }
    elementsStorage.trigger('remove', id)
  })
  storage.on('clone', (id) => {
    elementsStorage.trigger('clone', id)
  })
})
