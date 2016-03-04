let DataStorage = {
  value: '',
  update: function(elementsList) {
    this.value = elementsList;
  },
  getItem: function() {
    return this.value;
  }
};
let Data = {
  get: function() {
    return DataStorage.getItem() || '';
  }
};

Data.subscribe('data:changed', function(document) {
  let data = Array.prototype.slice.call(document.childNodes);
  let elementsList = data.map(function(element) {
    return element.innerHTML;
  });
  DataStorage.update(elementsList.join());
});
module.exports = Data;

