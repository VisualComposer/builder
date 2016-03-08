var vcCake = require('vc-cake');

vcCake.add('ui-save-data', function(api) {
  api.on('save', function() {
    var storage = vcCake.getService('wordpress-storage');
    var documentData = vcCake.getService('document');
    storage.save(documentData.all());
  });
  api.reply('start', function() {
    var storage = vcCake.getService('wordpress-storage');
    storage.get(function(request) {
      var data = JSON.parse(request.responseText);
      if (data) {
        var timeMachine = vcCake.getService('time-machine');
        timeMachine.setZeroState(data);
        this.request('data:reset', data);
      }
    }.bind(api));

  });
});
require('./lib/navbar-dropdown-control.js');
require('./lib/navbar-save-button');
