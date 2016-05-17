var vcCake = require('vc-cake')
vcCake.add('ui-undo-redo', function (api) {
  var timeMachine = vcCake.getService('time-machine')
  var doc = vcCake.getService('document')
  api.reply('data:changed', function (data, action) {
    if (action !== 'reset') {
      timeMachine.add(doc.all())
    }
    api.notify('added', data)
  })
})
require('./lib/navbar-controls')
