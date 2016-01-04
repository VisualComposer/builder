var Data = require('./Storage');
var LocalStorage = require('./LocalStorage');
// Add to app

Data.subscribe('app:init', function () {
    Data.setDocument(Data.parse('<Root id="vc-v-root-element">' + LocalStorage.get() + '</Root>'));
});
window.vcData = Data; // @todo should be removed.
module.exports = Data;