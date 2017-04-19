import vcCake from 'vc-cake'
import AddTemplate from './lib/addTemplate'
import AddTemplateNavbarControl from './lib/navbarControl'

vcCake.add('uiAddTemplate', (api) => {
  // subscribe to global events
  api
    .reply('app:templates', (isShown) => {
      if (isShown) {
        api.module('ui-layout-bar').do('setEndContent', AddTemplate, {
          api: api
        })
        api.module('ui-layout-bar').do('setEndContentVisible', true, 'add-template')
      } else {
        api.module('ui-layout-bar').do('setEndContent', null)
        api.module('ui-layout-bar').do('setEndContentVisible', false)
      }
    })

  api.module('ui-navbar').do('addElement', 'Add template', AddTemplateNavbarControl, { api: api })
  api.reply('start', () => {
    if (vcCake.env('platform') === 'wordpress') {
      vcCake.setData('myTemplates', window.vcvMyTemplates.map((template) => {
        template.id = template.id.toString()
        return template
      }))
    }
  })
})
