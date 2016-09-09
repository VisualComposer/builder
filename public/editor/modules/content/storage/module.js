import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')

vcCake.add('storage', (api) => {
  const DocumentData = api.getService('document')
  const rebuildRawLayout = (id, layout) => {
    let columns = DocumentData.children(id)
    let lastColumnObject = null
    layout.forEach((size, i) => {
      let cssPostFix = size.replace('/', '-')
      if (columns[i] !== undefined) {
        lastColumnObject = columns[i]
        lastColumnObject.size = cssPostFix
        DocumentData.update(lastColumnObject.id, lastColumnObject)
      } else {
        DocumentData.create({tag: 'column', parent: id, size: cssPostFix})
      }
    })
    if (columns.length > layout.length) {
      let removingColumns = columns.slice(layout.length)
      removingColumns.forEach((column) => {
        /* let childElements = DocumentData.children(column.id)
        childElements.forEach((el) => {
          el.parent = lastColumnObject.id
          DocumentData.update(el.id, el)
        }) */
        DocumentData.delete(column.id)
      })
    }
  }
  api.reply('data:add', (elementData) => {
    let createdElements = []
    let element = cook.get(elementData)
    if (!element.get('parent') && !element.relatedTo([ 'RootElements' ])) {
      let rowElement = DocumentData.create({ tag: 'row' })
      createdElements.push(rowElement.id)
      let columnElement = DocumentData.create({ tag: 'column', parent: rowElement.id })
      createdElements.push(columnElement.id)
      elementData.parent = columnElement.id
    }
    let data = DocumentData.create(elementData)
    createdElements.push(data.id)

    if (element.get('tag') === 'row') {
      let columnData = cook.get({ tag: 'column', parent: data.id })
      if (columnData) {
        let columnElement = DocumentData.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }
    }
    api.request('data:afterAdd', createdElements)
    api.request('data:changed', DocumentData.children(false), 'add')
  })

  api.reply('data:remove', (id) => {
    api.request('data:beforeRemove', id)
    DocumentData.delete(id)
    api.request('data:changed', DocumentData.children(false), 'remove')
  })

  api.reply('data:clone', (id) => {
    let dolly = DocumentData.clone(id)
    api.request('data:afterClone', dolly.id)
    api.request('data:changed', DocumentData.children(false), 'clone')
  })

  api.reply('data:update', (id, element) => {
    if (element.tag === 'row' && element.layout && element.layout.length > 0) {
      console.log(element.layout)
      rebuildRawLayout(id, element.layout)
      element.layout = undefined
    }
    DocumentData.update(id, element)
    api.request('data:afterUpdate', id, element)
    api.request('data:changed', DocumentData.children(false), 'update')
  })

  api.reply('data:move', (id, data) => {
    if (data.action === 'after') {
      DocumentData.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      DocumentData.appendTo(id, data.related)
    } else {
      DocumentData.moveBefore(id, data.related)
    }
    api.request('data:changed', DocumentData.children(false))
  })

  api.reply('data:reset', (content) => {
    DocumentData.reset(content || {})
    api.request('data:changed', DocumentData.children(false), 'reset')
  })
})
