import vcCake from 'vc-cake'
import AddTemplate from './lib/addTemplate'
import AddTemplateControl from './lib/navbarControl'
import './css/init.less'

vcCake.add('uiAddTemplate', (api) => {
  // subscribe to global events
  api
    .reply('app:templates', (isShown) => {
      if (isShown) {
        api.module('ui-layout-bar').do('setEndContent', AddTemplate, {
          api: api
        })
        api.module('ui-layout-bar').do('setEndContentVisible', true, 'add-template')
        api.module('ui-layout-bar').do('setStartContentVisible', false)
      } else {
        api.module('ui-layout-bar').do('setEndContent', null)
        api.module('ui-layout-bar').do('setEndContentVisible', false)
      }
    })

  api.module('ui-navbar').do('addElement', 'Add template', AddTemplateControl, { api: api })
  api.reply('start', () => {
    vcCake.setData('myTemplates', window.vcvMyTemplates || [])
  })
})
