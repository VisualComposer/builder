/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
const TreeForm = require('./lib/form')

const doc = vcCake.getService('document')
const cook = vcCake.getService('cook')

vcCake.add('ui-edit-element', function (api) {
  api.reply('app:edit', function (id) {
    let data = doc.get(id)
    let element = cook.get(data)
    api.module('ui-tree-layout').do('setContent', TreeForm, {
      element: element,
      api: api
    })
    api.request('tree-layout:show-content')
  })
})
