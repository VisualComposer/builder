import {addStorage} from 'vc-cake'

addStorage('workspace', (storage) => {
  storage.on('add', (elementId, tag, options) => {
    storage.state('settings').set({
      action: 'add',
      elementId: elementId,
      tag: tag,
      options: options
    })
  })
  storage.on('edit', (elementId, tag, options) => {
    storage.state('settings').set({
      action: 'edit',
      elementId: elementId,
      tag: tag,
      options: options
    })
  })
})
