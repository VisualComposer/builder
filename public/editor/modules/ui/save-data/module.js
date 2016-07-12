var vcCake = require('vc-cake')

vcCake.add('ui-local-storage', function (api) {
  api.reply('start', function () {
    var localStorage = vcCake.getService('local-storage')
    var timeMachine = vcCake.getService('time-machine')
    var data = localStorage.get()
    timeMachine.setZeroState(data)
    api.request('data:reset', data)
  })
})

vcCake.add('ui-save-data', function (api) {
  api.on('save', function () {
    var localStorage = vcCake.getService('local-storage')
    var documentData = vcCake.getService('document')
    localStorage.save(documentData.all())
  })
})
require('./lib/navbar-save-button')

// require('./lib/navbar-dropdown-control')

