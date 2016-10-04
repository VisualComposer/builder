import _ from 'lodash'
import vcCake from 'vc-cake'
import EditElementController from './lib/controller'

const DocumentData = vcCake.getService('document')
const cook = vcCake.getService('cook')

import './css/init.less'

vcCake.add('ui-edit-element', (api) => {
  let currentElementId = null

  api.reply('app:edit', (id, activeState = '') => {
    api.notify('show', id, activeState)
  })
  api
    .on('hide', () => {
      currentElementId = null
      api.module('ui-layout-bar').do('setEndContent', null)
      api.module('ui-layout-bar').do('setEndContentVisible', false)
    })
    .on('show', (id, activeState) => {
      currentElementId = id
      let data = DocumentData.get(id)
      let element = cook.get(data)
      api.module('ui-layout-bar').do('setEndContentVisible', true, 'edit-element')
      api.module('ui-layout-bar').do('setEndContent', EditElementController, {
        element: element,
        api: api,
        activeState: _.isEmpty(activeState) ? '' : activeState
      })
    })
    .reply('data:remove', (id) => {
      if (id === currentElementId) {
        api.notify('hide')
      }
    })
})
