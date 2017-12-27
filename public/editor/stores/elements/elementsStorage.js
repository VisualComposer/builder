import {addStorage, getStorage, getService} from 'vc-cake'
import {rebuildRawLayout, isElementOneRelation, addRowColumnBackground} from './lib/tools'

addStorage('elements', (storage) => {
  const documentManager = getService('document')
  // const timeMachineStorage = getStorage('timeMachine')
  const cook = getService('cook')
  const historyStorage = getStorage('history')
  const utils = getService('utils')
  const wordpressDataStorage = getStorage('wordpressData')
  const updateTimeMachine = () => {
    wordpressDataStorage.state('status').set({ status: 'changed' })
    historyStorage.trigger('add', documentManager.all())
  }
  let substituteIds = {}

  const recursiveElementsRebuild = (cookElement) => {
    if (!cookElement) {
      return cookElement
    }
    let cookGetAll = cookElement.getAll()

    let elementAttributes = Object.keys(cookGetAll)
    elementAttributes.forEach((attrKey) => {
      let attributeSettings = cookElement.settings(attrKey)
      if (attributeSettings.settings.type === 'element') {
        let value = cookElement.get(attrKey)
        let innerElement = cook.get(value)
        let innerElementValue = recursiveElementsRebuild(innerElement)
        cookElement.set(attrKey, innerElementValue)
      }
    })
    return cookElement.toJS(true, false)
  }
  const sanitizeData = (data) => {
    const newData = Object.assign({}, data || {})
    Object.keys(data).forEach((key) => {
      let cookElement = cook.get(data[ key ])
      if (!cookElement) {
        delete newData[ key ]
      } else {
        newData[key] = recursiveElementsRebuild(cookElement)
      }
    })
    return newData
  }

  storage.on('add', (elementData, wrap = true, options = {}) => {
    let createdElements = []
    let cookElement = cook.get(elementData)
    if (!cookElement) {
      return
    }
    elementData = recursiveElementsRebuild(cookElement)
    if (wrap && !cookElement.get('parent') && !cookElement.relatedTo([ 'RootElements' ])) {
      const rowElementSettings = cook.get({ tag: 'row' })
      let rowElement = documentManager.create(rowElementSettings.toJS())
      createdElements.push(rowElement.id)
      const columnElementSettings = cook.get({ tag: 'column', parent: rowElement.id }).toJS()
      let columnElement = documentManager.create(columnElementSettings)
      createdElements.push(columnElement.id)
      elementData.parent = columnElement.id
      rebuildRawLayout(rowElement.id, {}, documentManager, options)
    }
    let data = documentManager.create(elementData, {
      insertAfter: options && options.insertAfter ? options.insertAfter : false
    })
    createdElements.push(data.id)

    if (wrap && cookElement.get('tag') === 'row' && !elementData.skipInitialExtraElements) {
      let columnData = cook.get({ tag: 'column', parent: data.id })
      if (columnData) {
        let columnElement = documentManager.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }
    }
    if (wrap && cookElement.get('tag') === 'tabsWithSlide' && !elementData.skipInitialExtraElements) {
      let tabData = cook.get({ tag: 'tab', parent: data.id })
      let tabData1 = cook.get({ tag: 'tab', parent: data.id })
      if (tabData) {
        let tabElement = documentManager.create(tabData.toJS())
        let tabElement1 = documentManager.create(tabData1.toJS())
        createdElements.push(tabElement.id)
        createdElements.push(tabElement1.id)
      }
    }
    if (wrap && cookElement.get('tag') === 'section') {
      let rowData = cook.get({ tag: 'row', parent: data.id })
      let rowElement
      if (rowData) {
        rowElement = documentManager.create(rowData.toJS())
        createdElements.push(rowElement.id)
      }

      let columnData = cook.get({ tag: 'column', parent: rowElement.id })
      if (columnData) {
        let columnElement = documentManager.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }

      rebuildRawLayout(rowElement.id, {}, documentManager)
    }
    if (data.tag === 'column') {
      let rowElement = documentManager.get(data.parent)
      rebuildRawLayout(rowElement.id, { action: options.action === 'merge' ? 'mergeColumn' : 'columnAdd', columnSize: data.size, disableStacking: rowElement.layout.disableStacking }, documentManager)
      storage.trigger('update', rowElement.id, rowElement, '', options)
    }
    if (data.tag === 'row') {
      if (data.layout && data.layout.layoutData && data.layout.layoutData.length) {
        rebuildRawLayout(data.id, { layout: data.layout.layoutData }, documentManager)
        data.layout.layoutData = undefined
      } else {
        rebuildRawLayout(data.id, {}, documentManager)
      }
    }
    if (!options.silent) {
      storage.state('elementAdd').set(data)
      storage.state('document').set(documentManager.children(false))
      updateTimeMachine()
    }
  })
  storage.on('update', (id, element, source = '', options = {}) => {
    if (element.tag === 'row' && element.layout && element.layout.layoutData && element.layout.layoutData.length) {
      rebuildRawLayout(id, { layout: element.layout.layoutData, disableStacking: element.layout.disableStacking }, documentManager)
      element.layout.layoutData = undefined
    }
    documentManager.update(id, element)
    storage.state(`element:${id}`).set(element, source, options)
    if (element.tag === 'column') {
      addRowColumnBackground(id, element, documentManager)
      let rowElement = documentManager.get(element.parent)
      storage.trigger('update', rowElement.id, rowElement)
    }
    if (element.tag === 'tab') {
      let tabParent = documentManager.get(element.parent)
      storage.trigger('update', tabParent.id, tabParent)
    }
    if (!options.silent) {
      storage.state('document').set(documentManager.children(false))
      updateTimeMachine(source || 'elements')
    }
  })
  storage.on('remove', (id) => {
    let element = documentManager.get(id)
    if (!element) {
      return
    }
    let parent = element && element.parent ? documentManager.get(element.parent) : false
    documentManager.delete(id)
    if (parent && !documentManager.children(parent.id).length && element.tag === isElementOneRelation(parent.id, documentManager, cook)) {
      documentManager.delete(parent.id)
      parent = parent.parent ? documentManager.get(parent.parent) : false
    } else if (element.tag === 'column') {
      let rowElement = documentManager.get(parent.id)
      rebuildRawLayout(rowElement.id, { action: 'columnRemove', size: element.size, disableStacking: rowElement.layout.disableStacking }, documentManager)
      addRowColumnBackground(id, element, documentManager)
      storage.trigger('update', rowElement.id, documentManager.get(parent.id))
    }
    storage.state(`element:${id}`).delete()
    if (parent && element.tag !== 'column') {
      storage.state(`element:${parent.id}`).set(parent)
    } else {
      storage.state('document').set(documentManager.children(false))
    }
    updateTimeMachine()
  })
  storage.on('clone', (id) => {
    let dolly = documentManager.clone(id)
    if (dolly.tag === 'column') {
      let rowElement = documentManager.get(dolly.parent)
      rebuildRawLayout(rowElement.id, { action: 'columnClone', disableStacking: rowElement.layout.disableStacking }, documentManager)
      storage.trigger('update', rowElement.id, rowElement)
    }
    if (dolly.parent) {
      storage.state('element:' + dolly.parent).set(documentManager.get(dolly.parent))
    } else {
      storage.state('document').set(documentManager.children(false))
    }
    updateTimeMachine()
  }, {
    debounce: 250
  })
  storage.on('move', (id, data) => {
    let element = documentManager.get(id)
    if (data.action === 'after') {
      documentManager.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      documentManager.appendTo(id, data.related)
    } else {
      documentManager.moveBefore(id, data.related)
    }
    if (element.tag === 'column') {
      // rebuild previous column
      let rowElement = documentManager.get(element.parent)
      rebuildRawLayout(element.parent, { disableStacking: rowElement.layout.disableStacking }, documentManager)
      addRowColumnBackground(element.id, element, documentManager)
      // rebuild next column
      let newElement = documentManager.get(id)
      let newRowElement = documentManager.get(newElement.parent)
      addRowColumnBackground(newElement.id, newElement, documentManager)
      rebuildRawLayout(newElement.parent, { disableStacking: newRowElement.layout.disableStacking }, documentManager)
    }
    storage.state('document').set(documentManager.children(false))
    updateTimeMachine()
  })
  const mergeChildrenLayout = (data, parent) => {
    const children = Object.keys(data).filter((key) => {
      const element = data[ key ]
      return parent ? element.parent === parent : element.parent === '' || element.parent === parent
    })
    children.sort((a, b) => {
      if (typeof data[ a ].order === 'undefined') {
        data[ a ].order = 0
      }
      if (typeof data[ b ].order === 'undefined') {
        data[ b ].order = 0
      }
      return data[ a ].order - data[ b ].order
    })
    children.forEach((key) => {
      const element = data[ key ]
      const newId = utils.createKey()
      const oldId = '' + element.id
      if (substituteIds[ oldId ]) {
        element.id = substituteIds[ oldId ]
      } else {
        substituteIds[ oldId ] = newId
        element.id = newId
      }
      if (element.parent && substituteIds[ element.parent ]) {
        element.parent = substituteIds[ element.parent ]
      } else if (element.parent && !substituteIds[ element.parent ]) {
        substituteIds[ element.parent ] = utils.createKey()
        element.parent = substituteIds[ element.parent ]
      }
      delete element.order
      storage.trigger('add', element, false, { silent: true, action: 'merge' })
      mergeChildrenLayout(data, oldId)
    })
  }
  storage.on('merge', (content) => {
    const layoutData = JSON.parse(JSON.stringify(content))
    mergeChildrenLayout(layoutData, false)
    storage.state('document').set(documentManager.children(false), 'merge')
    substituteIds = {}
    updateTimeMachine()
  }, {
    debounce: 250,
    async: true
  })
  storage.on('reset', (data) => {
    let sanitizedData = sanitizeData(data)
    documentManager.reset(sanitizedData)
    historyStorage.trigger('init', sanitizedData)
    storage.state('document').set(documentManager.children(false), sanitizedData)
  })
  storage.on('updateAll', (data) => {
    documentManager.reset(sanitizeData(data))
    storage.state('document').set(documentManager.children(false), data)
  })
})
