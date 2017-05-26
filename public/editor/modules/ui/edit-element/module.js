import _ from 'lodash'
import vcCake from 'vc-cake'
import EditElementController from './lib/controller'

const DocumentData = vcCake.getService('document')
const cook = vcCake.getService('cook')

vcCake.add('ui-edit-element', (api) => {
  let currentElementId = null
  let currentElementRef = null

  api.reply('app:edit', (id, activeTabId = '') => {
    if (currentElementId !== id) {
      api.notify('show', id, activeTabId)
    } else if (currentElementRef && currentElementRef.getActiveTabId() !== activeTabId) {
      currentElementRef.setActiveTabId(activeTabId)
    }
  })
  vcCake.onDataChange('barContentEnd:Show', (Component) => {
    if (!Component || Component.name !== 'EditElementController') {
      currentElementId = null
      currentElementRef = null
    }
  })
  api
    .reply('bar-content-end:hide', () => {
      currentElementId = null
      currentElementRef = null
      api.module('ui-layout-bar').do('setEndContent', null)
    })
    .on('show', (id, activeTabId) => {
      let data = DocumentData.get(id)
      let element = cook.get(data)
      api.module('ui-layout-bar').do('setEndContentVisible', true, 'edit-element')
      api.module('ui-layout-bar').do('setEndContent', EditElementController, {
        element: element,
        api: api,
        activeTabId: _.isEmpty(activeTabId) ? '' : activeTabId,
        ref: (ref) => {
          currentElementRef = ref
        }
      })
      currentElementId = id
    })
    .reply('data:changed', () => {
      if (currentElementId && !DocumentData.get(currentElementId)) {
        api.request('bar-content-end:hide', true)
      }
    })
})
