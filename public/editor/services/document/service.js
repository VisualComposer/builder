var vcCake = require('vc-cake');
var Immutable = require('immutable');
var documentData = Immutable.Map({});

var dataStore = {
  createKey: function() {
    var i, random;
    var uuid = '';

    for (i = 0; i < 8; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }
    return uuid;
  },
  getChildren: function(id) {
    return documentData
      .valueSeq()
      .filter((i)=> {return i.get('parent') === id;})
      .sortBy((el) => {return el.get('order');});
  },
  getLastOrderIndex: function(id) {
    var lastObj =  this.getChildren(id).last();
    return lastObj ? lastObj.get('order') + 1 : 0;
  }
};

var api = {
  create: function(data) {
    var id = dataStore.createKey();
    var obj = Immutable.Map({
      id: id,
      parent: false,
      order: dataStore.getLastOrderIndex(data.parent_id || false)
    }).mergeDeep(data);
    documentData = documentData.set(id, obj);
    return obj.toJS();
  },
  delete: function(id) {
    document = documentData.delete(id);
  },
  update: function(id, data) {
    var obj = documentData.get(id).mergeDeep(data);
    documentData = documentData.set(id, obj);
    return obj.toJS();
  },
  get: function(id) {
    return documentData.get(id).toJS();
  },
  children: function(id) {
      return dataStore.getChildren(id).toJS();
  },
  move: function(id, parent_id, order) {
  },
  all: function() {
    return documentData.toJS();
  }
};

vcCake.addService('document', api);
