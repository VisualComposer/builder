var Mediator = require('../../helpers/Mediator');
let DataStorage = {
    dataId: 'vc-v-data',
    update: function(elementsList) {
        document.getElementById(this.dataId).value = elementsList;
    },
    getItem: function() {
        return document.getElementById(this.dataId).value;
    }
};
let Data = {
    get: function() {
        return DataStorage.getItem() || '';
    }
};
Mediator.installTo(Data);
Data.subscribe('data:changed', function(document){
    let data = Array.prototype.slice.call(document.childNodes);
    let elementsList = data.map(function(element){
        return element.innerHTML;
    });
    DataStorage.update(elementsList.join());
});
module.exports = Data;

