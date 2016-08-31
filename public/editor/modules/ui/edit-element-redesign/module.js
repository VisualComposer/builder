import vcCake from 'vc-cake'
import EditElementController from './lib/controller'

const DocumentData = vcCake.getService('document')
const cook = vcCake.getService('cook')

import './css/init.less'

vcCake.add('ui-edit-element', (api) => {
  let currentElementId = null

  api.reply('app:edit', (id) => {
    api.notify('show', id)
  })
  api
    .on('hide', () => {
      currentElementId = null
      api.module('ui-layout-bar').do('setEndContent', null)
      api.module('ui-layout-bar').do('setEndContentVisible', false)
    })
    .on('show', (id) => {
      currentElementId = id
      let data = DocumentData.get(id)
      let element = cook.get(data)
      api.module('ui-layout-bar').do('setEndContent', EditElementController, {
        element: element,
        api: api
      })
      api.module('ui-layout-bar').do('setEndContentVisible', true)
    })
    .reply('data:remove', (id) => {
      if (id === currentElementId) {
        api.notify('hide')
      }
    })
})
