var vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
vcCake.add('storage', function (api) {
  var documentData = api.getService('document')
  api.reply('data:add', function (element) {
    let data = documentData.create(element)
    if (data.name === 'Row') {
      let columnData = cook.get({tag: cook.getTagByName('Column'), parent: data.id})
      if (columnData) {
        documentData.create(columnData.toJS())
      }
    }
    api.request('data:changed', documentData.children(false), 'add')
  })
  api.reply('data:remove', function (id) {
    documentData.delete(id)
    api.request('data:changed', documentData.children(false), 'remove')
  })
  api.reply('data:clone', function (id) {
    documentData.clone(id)
    api.request('data:changed', documentData.children(false), 'clone')
  })
  api.reply('data:update', function (id, element) {
    documentData.update(id, element)
    api.request('data:changed', documentData.children(false), 'update')
  })
  api.reply('data:move', function (id, data) {
    if (data.action === 'after') {
      documentData.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      documentData.appendTo(id, data.related)
    } else {
      documentData.moveBefore(id, data.related)
    }
    api.request('data:changed', documentData.children(false))
  })
  api.reply('data:reset', function (content) {
    documentData.reset(content || {})
    api.request('data:changed', documentData.children(false), 'reset')
  })
})
