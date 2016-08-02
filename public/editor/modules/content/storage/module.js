import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')

vcCake.add('storage', (api) => {
  let documentData = api.getService('document')
  api.reply('data:add', (elementData) => {
    let element = cook.get(elementData)
    if (!element.get('parent') && !element.relatedTo(['RootElements'])) {
      let rowElement = documentData.create({tag: 'row'})
      let columnElement = documentData.create({tag: 'column', parent: rowElement.id})
      elementData.parent = columnElement.id
    }
    let data = documentData.create(elementData)
    if (element.get('tag') === 'row') {
      let columnData = cook.get({ tag: cook.getTagByName('Column'), parent: data.id })
      if (columnData) {
        documentData.create(columnData.toJS())
      }
    }

    api.request('data:changed', documentData.children(false), 'add')
  })

  api.reply('data:remove', (id) => {
    documentData.delete(id)
    api.request('data:changed', documentData.children(false), 'remove')
  })

  api.reply('data:clone', (id) => {
    documentData.clone(id)
    api.request('data:changed', documentData.children(false), 'clone')
  })

  api.reply('data:update', (id, element) => {
    documentData.update(id, element)
    api.request('data:changed', documentData.children(false), 'update')
  })

  api.reply('data:move', (id, data) => {
    if (data.action === 'after') {
      documentData.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      documentData.appendTo(id, data.related)
    } else {
      documentData.moveBefore(id, data.related)
    }
    api.request('data:changed', documentData.children(false))
  })

  api.reply('data:reset', (content) => {
    documentData.reset(content || {})
    api.request('data:changed', documentData.children(false), 'reset')
  })
})
