import {addStorage, getService} from 'vc-cake'

addStorage('workspace', (storage) => {
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
})
