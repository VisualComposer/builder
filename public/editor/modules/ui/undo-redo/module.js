var vcCake = require('vc-cake');
vcCake.add('ui-inline-editor', function(api){
  var timeMachine = vcCake.getService('time-machine');
  var doc = vcCake.getService('document');
  api.reply('data:changed', function(data, action){
    if('reset' !== action) {
      timeMachine.add(doc.all());
    }
    api.notify('added', data);
  });
});
require('./lib/navbar-controls');
