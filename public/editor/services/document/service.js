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
    const lastObj = this.getChildren(id).last()
    return lastObj ? lastObj.get('order') + 1 : 0
  },
  moveDownAfter: function (id, step) {
    const element = dataStore.data.get(id)
    const keys = dataStore.data.valueSeq().filter((el) => {
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
    const objectData = {
      id: id,
      parent: data.parent || false
    }
    if (!options || (!options.insertAfter && !options.insertInstead)) {
      objectData.order = dataStore.getLastOrderIndex(data.parent || false)
    }
    if (options && options.insertInstead && data.order) {
      objectData.order = data.order
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
    const obj = dataStore.data.get(id).merge(data)
    dataStore.data = dataStore.data.set(id, obj)
    return obj.toJS()
  },
  get: function (id) {
    const item = dataStore.data.get(id)
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
        const order = items.indexOf(item.get('id'))
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
    const before = dataStore.data.get(beforeId)
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
    const after = dataStore.data.get(afterId)
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
    const parent = dataStore.data.get(parentId)
    obj = obj.withMutations(function (map) {
      map
        .set('order', dataStore.getLastOrderIndex(parentId))
        .set('parent', parent ? parent.get('id') : false)
    })
    dataStore.data = dataStore.data.set(obj.get('id'), obj)
  },
  clone: function (id, parent, unChangeOrder) {
    const obj = dataStore.data.get(id)
    if (!obj) {
      return false
    }
    const cloneId = createKey()
    const clone = obj.withMutations(function (map) {
      map.set('id', cloneId)
      if (typeof parent !== 'undefined') {
        map.set('parent', parent)
      }
    })
    dataStore.data = dataStore.data.set(cloneId, clone)

    const cloneToJs = clone.toJS()
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
  copy: function (id) {
    const children = []
    const obj = dataStore.data.get(id)
    if (!obj) {
      return false
    }
    const cloneId = createKey()
    const clone = obj.withMutations(function (map) {
      map.set('id', cloneId)
      map.set('metaCustomId', '')
      map.set('parent', '')
    })

    dataStore.getChildren(obj.get('id')).forEach((el) => {
      children.push(this.copy(el.get('id'), cloneId, true))
    }, this)

    return {
      element: clone.toJS(),
      children
    }
  },
  getDescendants: function (id) {
    const descendantData = {}
    const element = dataStore.data.get(id)
    if (!element) {
      return false
    }

    const setChildrenData = (element, descendantData) => {
      const children = dataStore.getChildren(element.get('id'))
      children.forEach((child) => {
        descendantData[child.get('id')] = child.toJS()
        setChildrenData(child, descendantData)
      })
    }
    descendantData[id] = element.toJS()
    setChildrenData(element, descendantData)

    return descendantData
  },
  all: function () {
    return dataStore.data.toJS()
  },
  reset: function (data) {
    dataStore.data = Immutable.fromJS(data)
    dataStore.data = dataStore.data.map(map => map.set('order', parseInt(map.get('order'))))
  },
  size: function () {
    return dataStore.data.size
  },
  filter: function (callback) {
    return dataStore.data
      .valueSeq()
      .filter(callback).toJS()
  },
  getTopParent: function (id) {
    const obj = this.get(id)
    return obj && obj.parent ? this.getTopParent(obj.parent) : id
  },
  getByTag: function (tag) {
    const itemsByTag = {}
    const data = dataStore.data.toJS()
    Object.keys(data).map((key) => {
      if (data[key].tag === tag) {
        itemsByTag[key] = data[key]
      }
    })
    return itemsByTag
  }
}

vcCake.addService('document', api)
