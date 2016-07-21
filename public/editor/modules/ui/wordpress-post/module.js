const vcCake = require('vc-cake')
// const cook = vcCake.getService('cook')
const storage = vcCake.getService('wordpress-storage')
const documentData = vcCake.getService('document')

vcCake.add('ui-wp-load', function (api) {
  api.reply('start', function () {
    storage.get(function (request) {
      var data = JSON.parse(request.responseText || '{}')
      if (data) {
        // Todo fix saving ( empty Name, params all undefined toJS function)
        var timeMachine = vcCake.getService('time-machine')
        timeMachine.setZeroState(data)
        api.request('data:reset', data)
      }
    })
  })
})
// FEATURE TOGGLE.
vcCake.add('ui-save-data', function (api) {
  api.on('save', function () {
    storage.save(documentData.all())
  })
})
require('./lib/navbar-post-controls')
