import { addStorage, getService, getStorage } from 'vc-cake'

const createKey = getService('utils').createKey
const cacheStorage = getStorage('cache')

addStorage('workspace', (storage) => {
  const elementsStorage = getStorage('elements')
  const documentManager = getService('document')
  const cook = getService('cook')
  const isElementOneRelation = (parent) => {
    const children = cook.getContainerChildren(parent.tag)
    if (children.length === 1) {
      return children[0].tag
    }
    return false
  }
  storage.on('add', (id, tag, options) => {
    let element = false
    if (id) {
      element = documentManager.get(id)
    }
    if (element) {
      const oneTag = isElementOneRelation(element)
      if (oneTag) {
        const data = cook.get({ tag: oneTag, parent: id })
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
  storage.on('edit', (id, activeTab, options) => {
    if (!id) {
      return
    }
    const elementAccessPointService = getService('elementAccessPoint')
    let elementAccessPoint = elementAccessPointService.getInstance(id)

    if (options && options.nestedAttr) {
      // Trigger edit inside nestedAttr
      elementAccessPoint = options.parentElementAccessPoint
    }

    storage.state('settings').set({
      action: 'edit',
      elementAccessPoint: elementAccessPoint,
      activeTab: activeTab,
      options: options
    })
  })
  storage.on('remove', (id) => {
    const settings = storage.state('settings').get()
    elementsStorage.trigger('remove', id)

    // Close editForm if edit form is opened and element doesnt exist anymore
    if (settings && settings.action === 'edit' && settings.elementAccessPoint) {
      if (!documentManager.get(settings.elementAccessPoint.id)) {
        storage.state('settings').set(false)
      }
    }
  })
  storage.on('clone', (id) => {
    elementsStorage.trigger('clone', id)
  }, {
    debounce: 250
  })
  storage.on('copy', (id, tag, options) => {
    const element = documentManager.copy(id)
    const copyData = {
      element,
      options
    }
    storage.state('copyData').set(copyData)
    if (window.localStorage) {
      window.localStorage.setItem('vcv-copy-data', JSON.stringify(copyData))
    }
    cacheStorage.trigger('clear', 'controls')
  })
  const markLastChild = (data) => {
    if (data.children.length) {
      const lastChildIndex = data.children.length - 1
      data.children[lastChildIndex] = markLastChild(data.children[lastChildIndex])
    } else {
      data.lastItem = true
    }
    return data
  }
  const pasteElementAndChildren = (data, parentId, options = {}) => {
    const elementId = createKey()
    options = {
      ...options,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: parentId
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  const pasteAfter = (data, parentId, options = {}) => {
    const elementId = createKey()
    const parentEl = cook.getById(parentId).toJS()
    options = {
      ...options,
      insertAfter: parentId,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: parentEl.parent
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  const pasteEnd = (data, parentId, options = {}) => {
    const elementId = createKey()
    options = {
      ...options,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: false
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  storage.on('paste', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteElementAndChildren(copyData.element, id, copyData.options)
  })
  storage.on('pasteAfter', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteAfter(copyData.element, id, copyData.options)
  })
  storage.on('pasteEnd', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteEnd(copyData.element, id, copyData.options)
  })
  storage.on('move', (id, settings) => {
    elementsStorage.trigger('move', id, settings)
  })
  storage.on('drop', (id, settings) => {
    const relatedElement = settings.related ? cook.get(documentManager.get(settings.related)) : false
    let elementSettings = { tag: settings.element.tag }
    if (settings.options && settings.options.isPreset) {
      elementSettings = settings.options
    }
    if (relatedElement) {
      elementSettings.parent = relatedElement.get('parent')
    }
    const data = cook.get(elementSettings)
    elementsStorage.trigger('add', data.toJS())
    let movingID = data.get('id')
    if (settings.action !== 'append' && relatedElement && relatedElement.relatedTo(['RootElements']) && !data.relatedTo(['RootElements'])) {
      movingID = documentManager.getTopParent(movingID)
    }
    elementsStorage.trigger('move', movingID, settings)
    storage.trigger('edit', data.toJS().id, '')
  })
  storage.on('start', () => {
    storage.state('app').set('started')
  })
  storage.on('addTemplate', () => {
    storage.state('settings').set({
      action: 'addTemplate',
      element: false,
      tag: false,
      options: {}
    })
  })
  storage.on('hide', (id, options) => {
    if (!id) {
      return
    }
    const element = documentManager.get(id)
    if (!element) {
      return
    }

    const newElement = element
    newElement.hidden = !element.hidden
    elementsStorage.trigger('update', id, newElement, '', { hidden: element.hidden, action: 'hide' })
  })
  storage.state('navbarBoundingRect').set({
    resizeTop: 0,
    resizeLeft: 0
  })
  storage.on('removeFromDownloading', (tag) => {
    let downloadingItems = storage.state('downloadingItems').get() || []
    downloadingItems = downloadingItems.filter(downloadingTag => downloadingTag !== tag)
    storage.state('downloadingItems').set(downloadingItems)
  })
})
