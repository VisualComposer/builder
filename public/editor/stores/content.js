import {addStorage, getService} from 'vc-cake'

addStorage('content', (storage) => {
  const documentManager = getService('document')
  const cook = getService('cook')
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
      console.log(documentManager.children(false))
      storage.state('document').set(documentManager.children(false))
    }
  })
  // storage.state('document').set(documentManager.children(false))
})
