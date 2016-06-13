const vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
const storage = vcCake.getService('wordpress-storage')
const documentData = vcCake.getService('document')
const reWrapDefaultContent = function (data) {
  let newData = {}
  Object.keys(data).forEach((k) => {
    newData[ k ] = data[ k ]
    newData[ k ].tag = cook.getTagByName(newData[ k ].name)
  })
  return newData
}
vcCake.add('ui-wp-load', function (api) {
  api.reply('start', function () {
    storage.get(function (request) {
      var data = JSON.parse(request.responseText || '{}')
      if (data) {
        data = reWrapDefaultContent(data)
        var timeMachine = vcCake.getService('time-machine')
        timeMachine.setZeroState(data)
        api.request('data:reset', data)
      }
    })
  })
})
if (false) {
  // FEATURE TOGGLE.
  vcCake.add('ui-save-data', function (api) {
    api.on('save', function () {
      storage.save(documentData.all())
    })
    api.reply('start', function () {
      storage.get(function (request) {
        var data = JSON.parse(request.responseText || '{}')
        if (data) {
          data = reWrapDefaultContent(data)
          var timeMachine = vcCake.getService('time-machine')
          timeMachine.setZeroState(data)
          api.request('data:reset', data)
        }
      })
    })
  })
  require('./lib/navbar-dropdown-control')
  require('./lib/navbar-save-button')
}
