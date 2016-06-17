var vcCake = require('vc-cake')
const Immutable = require('immutable')

let dataStore = {
  data: Immutable.fromJS({}),
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
    return dataStore.data
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
    var element = dataStore.data.get(id)
    var keys = dataStore.data.valueSeq().filter((el) => {
      return el.get('id') !== element.get('id') &&
        el.get('parent') === element.get('parent') &&
        el.get('order') >= element.get('order')
    }).map((el) => {
      return el.get('id')
    }).toJS()
    keys.forEach(function (elId) {
      var obj = dataStore.data.get(elId)
      obj = obj.set('order', obj.get('order') + step)
      dataStore.data = dataStore.data.set(elId, obj)
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
    dataStore.data = dataStore.data.set(id, obj)
    return obj.toJS()
  },
  delete: function (id) {
    dataStore.data = dataStore.data.delete(id)
    dataStore.getChildren(id).forEach((el) => {
      this.delete(el.get('id'))
    }, this)
    return id
  },
  update: function (id, data) {
    var obj = dataStore.data.get(id).merge(data)
    dataStore.data = dataStore.data.set(id, obj)
    return obj.toJS()
  },
  get: function (id) {
    var item = dataStore.data.get(id)
    return item ? item.toJS() : null
  },
  children: function (id) {
    return dataStore.getChildren(id).toJS()
  },
  resort: function (parentId, items) {
    parentId = dataStore.filterId(parentId)
    items.forEach(function (id) {
      var item = dataStore.data.get(id)
      if (item) {
        var order = items.indexOf(item.get('id'))
        item = item.withMutations(function (map) {
          map
            .set('parent', parentId)
            .set('order', order)
        })
        dataStore.data = dataStore.data.set(id, item)
      }
    }, this)
  },
  moveBefore: function (id, beforeId) {
    var obj = dataStore.data.get(id)
    var before = dataStore.data.get(beforeId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', before.get('order'))
        .set('parent', before.get('parent'))
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
    dataStore.moveDownAfter(obj.get('id'), 1)
  },
  moveAfter: function (id, afterId) {
    var obj = dataStore.data.get(id)
    var after = dataStore.data.get(afterId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', after.get('order'))
        .set('parent', after.get('parent'))
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
    dataStore.moveDownAfter(after.get('id'), 1)
  },
  appendTo: function (id, parentId) {
    var obj = dataStore.data.get(id)
    var parent = dataStore.data.get(parentId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', dataStore.getLastOrderIndex(parentId))
        .set('parent', parent.get('id'))
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
  },
  clone: function (id, parent, unChangeOrder) {
    var obj = dataStore.data.get(id)
    if (!obj) {
      return false
    }
    var cloneId = dataStore.createKey()
    var clone = obj.withMutations(function (map) {
      map.set('id', cloneId)
      if (typeof parent !== 'undefined') {
        map.set('parent', parent)
      }
    })
    dataStore.data = dataStore.data.set(cloneId, clone)
    dataStore.getChildren(obj.get('id')).forEach((el) => {
      this.clone(el.get('id'), cloneId, true)
    }, this)
    if (unChangeOrder !== true) {
      this.moveAfter(cloneId, id)
    }
    return clone.toJS()
  },
  all: function () {
    return dataStore.data.toJS()
  },
  reset: function (data) {
    dataStore.data = Immutable.fromJS(data)
  }
}

vcCake.addService('document', api)
