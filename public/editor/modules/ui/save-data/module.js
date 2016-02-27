var vcCake = require('vc-cake');

vcCake.add('ui-save-data', function(api) {
  api.on('save', function() {
    var localStorage = vcCake.getService('local-storage');
    var documentData = vcCake.getService('document');
    localStorage.save(documentData.all());
  });
  api.reply('start', function() {
    var localStorage = vcCake.getService('local-storage');
    api.request('data:set', localStorage.get());
  });
});
require('./lib/navbar-save-button');
