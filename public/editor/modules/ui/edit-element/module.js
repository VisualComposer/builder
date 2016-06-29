/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
const TreeForm = require('./lib/form')

const doc = vcCake.getService('document')
const cook = vcCake.getService('cook')

vcCake.add('ui-edit-element', function (api) {
  api.reply('app:edit', function (id) {
    api.notify('show', id)
  }).on('hide', () => {
    api.module('ui-layout-bar').do('setEndContent', null)
    api.module('ui-layout-bar').do('setEndContentVisible', false)
    api.request('tree-view:hide')
  }).on('show', (id) => {
    let data = doc.get(id)
    let element = cook.get(data)
    api.module('ui-layout-bar').do('setEndContent', TreeForm, {
      element: element,
      api: api
    })
    api.module('ui-layout-bar').do('setEndContentVisible', true)
    // api.request('tree-layout:show-content')
  })
})
