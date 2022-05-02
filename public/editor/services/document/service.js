import store from 'public/editor/stores/store'
import { set, reset, update, remove, appendTo, moveBefore, moveAfter, clone } from 'public/editor/stores/document/slice'

const vcCake = require('vc-cake')
const createKey = vcCake.getService('utils').createKey

const dataStore = {
  getChildren: function (id) {
    const documentData = store.getState().document.documentData
    return Object.keys(documentData)
      .map((id) => JSON.parse(JSON.stringify(documentData[id])))
      .filter((el) => el.parent === id)
      .sort((a, b) => a.order - b.order)
  },
  getLastOrderIndex: function (id) {
    const children = this.getChildren(id)
    const lastObj = children[children.length - 1]
    return lastObj ? lastObj.order + 1 : 0
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
    const obj = Object.assign(data, objectData)

    store.dispatch(set([id, obj, options]))

    return JSON.parse(JSON.stringify(obj))
  },
  delete: function (id) {
    let deleted = []
    store.dispatch(remove(id))

    deleted.push(id)
    dataStore.getChildren(id).forEach((el) => {
      deleted = deleted.concat(this.delete(el.id))
    }, this)
    return deleted
  },
  update: function (id, data) {
    store.dispatch(update([id, data]))
  },
  get: function (id) {
    const data = store.getState().document.documentData[id]
    return data ? JSON.parse(JSON.stringify(data)) : null
  },
  children: function (id) {
    return JSON.parse(JSON.stringify(dataStore.getChildren(id)))
  },
  moveBefore: function (id, beforeId) {
    store.dispatch(moveBefore([id, beforeId]))
  },
  moveAfter: function (id, afterId) {
    store.dispatch(moveAfter([id, afterId]))
  },
  appendTo: function (id, parentId) {
    store.dispatch(appendTo([id, parentId, dataStore.getLastOrderIndex(parentId)]))
  },
  clone: function (id, parent, unChangeOrder) {
    const cloneId = createKey()
    store.dispatch(clone([id, cloneId, parent, unChangeOrder]))
    return this.get(cloneId)
  },
  copy: function (id) {
    const children = []
    const clone = this.get(id)
    if (!clone) {
      return false
    }
    clone.id = createKey()
    clone.metaCustomId = ''
    clone.parent = ''

    dataStore.getChildren(id).forEach((el) => {
      children.push(this.copy(el.id))
    }, this)

    return {
      element: clone,
      children
    }
  },
  getDescendants: function (id, descendantData = {}) {
    const element = this.get(id)
    if (!element) {
      return false
    }

    descendantData[id] = element

    dataStore.getChildren(id).forEach((child) => {
      this.getDescendants(child.id, descendantData)
    })

    return descendantData
  },
  all: function () {
    return JSON.parse(JSON.stringify(store.getState().document.documentData))
  },
  reset: function (data) {
    store.dispatch(reset(data))
  },
  size: function () {
    return Object.keys(store.getState().document.documentData).length
  },
  filter: function (callback) {
    const data = store.getState().document.documentData
    return Object.keys(data).map((key) => {
      return JSON.parse(JSON.stringify(data[key]))
    }).filter(callback)
  },
  getTopParent: function (id) {
    const obj = this.get(id)
    return obj && obj.parent ? this.getTopParent(obj.parent) : id
  },
  getByTag: function (tag) {
    const itemsByTag = {}
    const data = store.getState().document.documentData
    Object.keys(data).map((key) => {
      if (data[key].tag === tag) {
        itemsByTag[key] = JSON.parse(JSON.stringify(data[key]))
      }
    })
    return itemsByTag
  }
}

vcCake.addService('document', api)
