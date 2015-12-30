var Data = require('./Storage');
var Storage = require('./PostMetaData');
// Add to app
Data.subscribe('app:init', function () {
    DataStore.document = Data.parse('<Root id="vc-v-root-element">' + Storage.get() + '</Root>');
    Data.publish('data:changed', Data.getDocument());
});
window.vcData = Data; // @todo should be removed.

module.exports = Data;