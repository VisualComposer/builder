import vcCake from 'vc-cake'
import $ from 'jquery'

vcCake.add('content-wordpress-data-save', (api) => {
  let initialStart = true
  let unload = {
    setDataChanged: () => {
      if (initialStart) {
        initialStart = false
        return
      }
      $(window).bind('beforeunload.vcv-save', (e) => {
        return 'Are you sure to leave? All unsaved data will be changed?'
      })
    },
    unsetDataChanged: () => {
      $(window).unbind('beforeunload.vcv-save')
    }
  }
  api.reply('data:changed', unload.setDataChanged)
  api.reply('wordpress:data:saved', unload.unsetDataChanged)
})
