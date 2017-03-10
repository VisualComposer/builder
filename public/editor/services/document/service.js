const vcCake = require('vc-cake')
const Immutable = require('immutable')
const createKey = vcCake.getService('utils').createKey

const dataStore = {
  data: Immutable.fromJS({}),
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
    let lastObj = this.getChildren(id).last()
    return lastObj ? lastObj.get('order') + 1 : 0
  },
  moveDownAfter: function (id, step) {
    let element = dataStore.data.get(id)
    let keys = dataStore.data.valueSeq().filter((el) => {
      return el.get('id') !== element.get('id') &&
        el.get('parent') === element.get('parent') &&
        el.get('order') >= element.get('order')
    }).map((el) => {
      return el.get('id')
    }).toJS()
    keys.forEach(function (elId) {
      let obj = dataStore.data.get(elId)
      obj = obj.set('order', obj.get('order') + step)
      dataStore.data = dataStore.data.set(elId, obj)
    }, this)
  }
}

const api = {
  create: function (data, options = {}) {
    const id = data.id || createKey()
    let objectData = {
      id: id,
      parent: data.parent || false
    }
    if (!options || !options.insertAfter) {
      objectData.order = dataStore.getLastOrderIndex(data.parent || false)
    }
    const obj = Immutable.Map(data).mergeDeep(objectData)
    dataStore.data = dataStore.data.set(id, obj)
    if (options && options.insertAfter) {
      this.moveAfter(id, options.insertAfter)
    }
    return obj.toJS()
  },
  delete: function (id) {
    let deleted = []
    dataStore.data = dataStore.data.delete(id)
    deleted.push(id)
    dataStore.getChildren(id).forEach((el) => {
      deleted = deleted.concat(this.delete(el.get('id')))
    }, this)
    return deleted
  },
  update: function (id, data) {
    let obj = dataStore.data.get(id).merge(data)
    dataStore.data = dataStore.data.set(id, obj)
    return obj.toJS()
  },
  get: function (id) {
    let item = dataStore.data.get(id)
    return item ? item.toJS() : null
  },
  children: function (id) {
    return dataStore.getChildren(id).toJS()
  },
  resort: function (parentId, items) {
    parentId = dataStore.filterId(parentId)
    items.forEach(function (id) {
      let item = dataStore.data.get(id)
      if (item) {
        let order = items.indexOf(item.get('id'))
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
    let obj = dataStore.data.get(id)
    let before = dataStore.data.get(beforeId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', before.get('order'))
        .set('parent', before.get('parent'))
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
    dataStore.moveDownAfter(obj.get('id'), 1)
  },
  moveAfter: function (id, afterId) {
    let obj = dataStore.data.get(id)
    let after = dataStore.data.get(afterId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', after.get('order'))
        .set('parent', after.get('parent'))
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
    dataStore.moveDownAfter(after.get('id'), 1)
  },
  appendTo: function (id, parentId) {
    let obj = dataStore.data.get(id)
    let parent = dataStore.data.get(parentId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', dataStore.getLastOrderIndex(parentId))
        .set('parent', parent ? parent.get('id') : false)
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
  },
  clone: function (id, parent, unChangeOrder) {
    let obj = dataStore.data.get(id)
    if (!obj) {
      return false
    }
    let cloneId = createKey()
    let clone = obj.withMutations(function (map) {
      map.set('id', cloneId)
      if (typeof parent !== 'undefined') {
        map.set('parent', parent)
      }
    })
    dataStore.data = dataStore.data.set(cloneId, clone)

    let cloneToJs = clone.toJS()
    if (cloneToJs.metaCustomId) {
      cloneToJs.metaCustomId = false
      this.update(cloneId, cloneToJs)
    }

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
  },
  size: function () {
    return dataStore.data.size
  },
  filter: function (callback) {
    return dataStore.data
      .valueSeq()
      .filter(callback).toJS()
  }
}

vcCake.addService('document', api)
