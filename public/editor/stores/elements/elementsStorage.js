import {addStorage, getStorage, getService, env} from 'vc-cake'
import {rebuildRawLayout, addRowBackground, isElementOneRelation} from './lib/tools'
addStorage('elements', (storage) => {
  const documentManager = getService('document')
  const timeMachine = getService('time-machine')
  const cook = getService('cook')
  const assets = getStorage('assets')
  const updateTimemachine = () => {
    timeMachine.add(documentManager.all())
    storage.state('undo').set(true)
  }
  storage.on('add', (elementData, wrap = true, options = {}) => {
    let createdElements = []
    let element = cook.get(elementData)
    if (wrap && !element.get('parent') && !element.relatedTo([ 'RootElements' ])) {
      let rowElement = documentManager.create({ tag: 'row' })
      createdElements.push(rowElement.id)
      let columnElement = documentManager.create({ tag: 'column', parent: rowElement.id })
      createdElements.push(columnElement.id)
      elementData.parent = columnElement.id
    }
    let data = documentManager.create(elementData, {
      insertAfter: options && options.insertAfter ? options.insertAfter : false
    })
    createdElements.push(data.id)

    if (wrap && element.get('tag') === 'row') {
      let columnData = cook.get({ tag: 'column', parent: data.id })
      if (columnData) {
        let columnElement = documentManager.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }
    }
    storage.state('document').set(documentManager.children(false))
    updateTimemachine()
  })
  storage.on('update', (id, element) => {
    if (env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      let children = false
      if (element.tag === 'row' && element.layout && element.layout.layoutData && element.layout.layoutData.length) {
        children = rebuildRawLayout(id, element.layout.layoutData, documentManager)
        element.rowLayout = element.layout.layoutData
        element.size = element.layout.layoutData
        element.layout.layoutData = undefined
      }
      if (element.tag === 'column') {
        let parentId = documentManager.get(id).parent
        let parentElement = documentManager.get(parentId)

        if (parentElement) {
          addRowBackground(parentId, parentElement, documentManager)
        }
      }
      if (element.tag === 'row') {
        addRowBackground(id, element, documentManager)
      }
      children && children.forEach((stack) => {
        const [element, action] = stack
        const id = element.id
        storage.state('element:' + id).set(element)
        assets.trigger(`${action}Element`, id)
      })
    } else {
      if (element.tag === 'row' && element.layout && element.layout.length) {
        rebuildRawLayout(id, element.layout, documentManager)
        element.layout = undefined
      }
    }
    documentManager.update(id, element)
    storage.state('element:' + id).set(element)
    assets.trigger('updateElement', id)
    updateTimemachine()
  })
  storage.on('remove', (id) => {
    let element = documentManager.get(id)
    let parent = element && element.parent ? documentManager.get(element.parent) : false
    documentManager.delete(id)
    if (parent && !documentManager.children(parent.id).length && element.tag === isElementOneRelation(parent.id, documentManager, cook)) {
      documentManager.delete(parent.id)
      parent = parent.parent ? documentManager.get(parent.parent) : false
    }
    if (parent) {
      storage.state('element:' + parent.id).set(parent)
    } else {
      storage.state('document').set(documentManager.children(false))
    }
    updateTimemachine()
  })
  storage.on('clone', (id) => {
    let dolly = documentManager.clone(id)
    storage.state('element:' + dolly.id).set(dolly)
    storage.state('document').set(documentManager.children(false))
  })
  storage.on('move', (id, data) => {
    if (data.action === 'after') {
      documentManager.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      documentManager.appendTo(id, data.related)
    } else {
      documentManager.moveBefore(id, data.related)
    }
    storage.state('document').set(documentManager.children(false))
  })
  // Need to rewrite
  storage.state('document').onChange(() => {
    // Maybe we can move it the top of the structure.
    updateTimemachine()
    // storage.state('redo').set(true)
  })
  storage.on('reset', (data) => {
    storage.state('document').set(data)
  })
  storage.state('document').set(documentManager.children(false))
  /*
  Undo
   const TimeMachine = vcCake.getService('time-machine')
   this.props.api.request('data:reset', TimeMachine.undo()
   */
  /*
  Redo
   const TimeMachine = vcCake.getService('time-machine')
   this.props.api.request('data:reset', TimeMachine.redo())
   */
})
