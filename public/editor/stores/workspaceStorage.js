import {addStorage, getService, getStorage} from 'vc-cake'

addStorage('workspace', (storage) => {
  const elementsStorage = getStorage('elements')
  const localStorage = getStorage('localStorage')
  const documentManger = getService('document')
  const cook = getService('cook')
  const isElementOneRelation = (parent) => {
    let children = cook.getChildren(parent.tag)
    if (children.length === 1) {
      return children[ 0 ].tag
    }
    return false
  }
  storage.on('add', (id, tag, options) => {
    let element = false
    if (id) {
      element = documentManger.get(id)
    }
    if (element) {
      let oneTag = isElementOneRelation(element)
      if (oneTag) {
        let data = cook.get({ tag: oneTag, parent: id })
        elementsStorage.trigger('add', data.toJS(), true, options)
        return
      }
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
    if (settings && (settings.action === 'edit' || settings.action === 'add')) {
      storage.state('settings').set({})
    }
    elementsStorage.trigger('remove', id)
  })
  storage.on('clone', (id) => {
    elementsStorage.trigger('clone', id)
  })
  storage.on('move', (id, settings) => {
    elementsStorage.trigger('move', id, settings)
  })
  storage.on('start', () => {
    localStorage.trigger('start')
  })
})
