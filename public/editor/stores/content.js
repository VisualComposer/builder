import {addStorage, getStorage, getService} from 'vc-cake'

addStorage('content', (storage) => {
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
      storage.state('document').set(documentManager.children(false))
      assets.trigger('addElement', createdElements)
    }
  })
  storage.on('update', (id, elementData) => {})
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
