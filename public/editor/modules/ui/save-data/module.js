var vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
const reWrapDefaultContent = function (data) {
  let newData = {}
  Object.keys(data).forEach((k) => {
    newData[k] = data[k]
    newData[k].tag = cook.getTagByName(newData[k].name)
  })
  return newData
}

vcCake.add('ui-local-storage', function (api) {
  api.reply('start', function () {
    var localStorage = vcCake.getService('local-storage')
    var timeMachine = vcCake.getService('time-machine')
    var data = localStorage.get();
    data = reWrapDefaultContent(data)
    timeMachine.setZeroState(data)
    api.request('data:reset', data)
  })
})
if (false) {
  vcCake.add('ui-save-data', function (api) {
    api.on('save', function () {
      var localStorage = vcCake.getService('local-storage')
      var documentData = vcCake.getService('document')
      localStorage.save(documentData.all())
    })
    api.reply('start', function () {
      var localStorage = vcCake.getService('local-storage')
      var timeMachine = vcCake.getService('time-machine')
      timeMachine.setZeroState(localStorage.get())
      api.request('data:reset', localStorage.get())
    })
  })
  require('./lib/navbar-save-button')
}
