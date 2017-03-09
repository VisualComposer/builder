import {addStorage, getStorage, getService, env} from 'vc-cake'
import {rebuildRawLayout, addRowBackground} from './lib/tools'
addStorage('elements', (storage) => {
  const documentManager = getService('document')
  const timeMachine = getService('time-machine')
  const cook = getService('cook')
  const assets = getStorage('assets')
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
    if (!options.silent) {
      // api.request('data:afterAdd', createdElements)
      createdElements.forEach((id) => {
        storage.state('element:' + id).set(element)
      })
      storage.state('document').set(documentManager.children(false))
      assets.trigger('addElement', createdElements)
    }
  })
  storage.on('update', (id, element) => {
    if (env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      if (element.tag === 'row' && element.layout && element.layout.layoutData && element.layout.layoutData.length) {
        rebuildRawLayout(id, element.layout.layoutData, documentManager)
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
    } else {
      if (element.tag === 'row' && element.layout && element.layout.length) {
        rebuildRawLayout(id, element.layout, documentManager)
        element.layout = undefined
      }
    }
    documentManager.update(id, element)
    storage.state('element:' + id).set(element)
    assets.trigger('updateElement', id)
  })
  storage.on('destroy', (id, elementData) => {})
  storage.on('clone', (id) => {})
  storage.state('document').set(documentManager.children(false))
  // Need to rewrite
  storage.state('document').onChange(() => {
    // Maybe we can move it the top of the structure.
    timeMachine.add(documentManager.all())
    storage.state('undo').set(true)
    storage.state('redo').set(true)
  })
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
