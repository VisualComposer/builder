var Mediator = require('../../helpers/Mediator');
let DataStorage = {
    dataKey: 'vcData',
    update: function(elementsList) {
        window.localStorage.setItem(this.dataKey, elementsList);
    },
    getItem: function() {
        return window.localStorage.getItem(this.dataKey);
    }
};
let Data = {
    get: function() {
        return DataStorage.getItem() || '';
    }
};
Mediator.installTo(Data);
Data.subscribe('data:changed', function(document){
    window.vcTest = document;
    let data = Array.prototype.slice.call(document.childNodes);
    let elementsList = data.map(function(element){
        return element.innerHTML;
    });
    DataStorage.update(elementsList.join());
});
module.exports = Data;

