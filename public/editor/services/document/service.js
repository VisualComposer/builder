var vcCake = require('vc-cake')
const Immutable = require('immutable')
let documentData = Immutable.Map({})

var dataStore = {
  createKey: function () {
    var i, random
    var uuid = ''

    for (i = 0; i < 8; i++) {
      random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16)
    }
    return uuid
  },
  getChildren: function (id) {
    return documentData
      .valueSeq()
      .filter((el) => {
        return el.get('parent') === id
      })
      .sortBy((el) => {
        return el.get('order')
      })
  },
  getLastOrderIndex: function (id) {
    var lastObj = this.getChildren(id).last()
    return lastObj ? lastObj.get('order') + 1 : 0
  },
  moveDownAfter: function (id, step) {
    var element = documentData.get(id)
    var keys = documentData.valueSeq().filter((el) => {
      return el.get('id') !== element.get('id') &&
        el.get('parent') === element.get('parent') &&
        el.get('order') >= element.get('order')
    }).map((el) => {
      return el.get('id')
    }).toJS()
    keys.forEach(function (elId) {
      var obj = documentData.get(elId)
      obj = obj.set('order', obj.get('order') + step)
      documentData = documentData.set(elId, obj)
    }, this)
  }
}

var api = {
  create: function (data) {
    var id = dataStore.createKey()
    var obj = Immutable.Map(data).mergeDeep({
      id: id,
      parent: data.parent || false,
      order: dataStore.getLastOrderIndex(data.parent || false)
    })
    documentData = documentData.set(id, obj)
    return obj.toJS()
  },
  delete: function (id) {
    documentData = documentData.delete(id)
    dataStore.getChildren(id).forEach((el) => {
      this.delete(el.get('id'))
    }, this)
    return id
  },
  update: function (id, data) {
    var obj = documentData.get(id).merge(data)
    documentData = documentData.set(id, obj)
    return obj.toJS()
  },
  get: function (id) {
    var item = documentData.get(id)
    return item ? item.toJS() : null
  },
  children: function (id) {
    return dataStore.getChildren(id).toJS()
  },
  resort: function (parentId, items) {
    parentId = dataStore.filterId(parentId)
    items.forEach(function (id) {
      var item = documentData.get(id)
      if (item) {
        var order = items.indexOf(item.get('id'))
        item = item.withMutations(function (map) {
          map
            .set('parent', parentId)
            .set('order', order)
        })
        documentData = documentData.set(id, item)
      }
    }, this)
  },
  moveBefore: function (id, beforeId) {
    var obj = documentData.get(id)
    var before = documentData.get(beforeId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', before.get('order'))
        .set('parent', before.get('parent'))
    })
    documentData = documentData.set(obj.get('id'), obj)
    dataStore.moveDownAfter(obj.get('id'), 1)
  },
  moveAfter: function (id, afterId) {
    var obj = documentData.get(id)
    var after = documentData.get(afterId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', after.get('order'))
        .set('parent', after.get('parent'))
    })
    documentData = documentData.set(obj.get('id'), obj)
    dataStore.moveDownAfter(after.get('id'), 1)
  },
  appendTo: function (id, parentId) {
    var obj = documentData.get(id)
    var parent = documentData.get(parentId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', dataStore.getLastOrderIndex())
        .set('parent', parent.get('id'))
    })
    documentData = documentData.set(obj.get('id'), obj)
  },
  clone: function (id, parent, unChangeOrder) {
    var obj = documentData.get(id)
    var cloneId = dataStore.createKey()
    var clone = obj.withMutations(function (map) {
      map.set('id', cloneId)
      if (typeof parent !== 'undefined') {
        map.set('parent', parent)
      }
    })
    documentData = documentData.set(cloneId, clone)
    dataStore.getChildren(obj.get('id')).forEach((el) => {
      this.clone(el.get('id'), cloneId, true)
    }, this)
    if (unChangeOrder !== true) {
      this.moveAfter(cloneId, id)
    }
    return clone.toJS()
  },
  all: function () {
    return documentData.toJS()
  },
  reset: function (data) {
    documentData = Immutable.fromJS(data)
  }
}

vcCake.addService('document', api)
