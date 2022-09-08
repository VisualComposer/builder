import store from 'public/editor/stores/store'
import { set, reset, update, remove, appendTo, moveBefore, moveAfter, clone } from 'public/editor/stores/document/slice'

const vcCake = require('vc-cake')
const createKey = vcCake.getService('utils').createKey

interface ObjectData {
  id: string,
  parent: string|boolean,
  order?: number
}

const dataStore = {
  getChildren: function (id:string|boolean) {
    const documentData = store.getState().document.documentData
    return Object.keys(documentData)
      // @ts-ignore accessing object property via bracket notation
      .map((id) => JSON.parse(JSON.stringify(documentData[id])))
      .filter((el) => el.parent === id)
      .sort((a, b) => a.order - b.order)
  },
  getLastOrderIndex: function (id:string|boolean) {
    const children = this.getChildren(id)
    const lastObj = children[children.length - 1]
    return lastObj ? lastObj.order + 1 : 0
  }
}

const api = {
  create: function (data: {id:string, parent:string|boolean, order:number}, options:{insertAfter?:boolean, insertInstead?:boolean} = {}) {
    const id = data.id || createKey()
    const objectData:ObjectData = {
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
  delete: function (id:string) {
    let deleted:string[] = []
    store.dispatch(remove(id))

    deleted.push(id)
    dataStore.getChildren(id).forEach((el) => {
      deleted = deleted.concat(this.delete(el.id))
    }, this)
    return deleted
  },
  // disabling lint, because data can be any element object with different properties
  update: function (id:string, data:any) { // eslint-disable-line
    store.dispatch(update([id, data]))
  },
  get: function (id:string) {
    // @ts-ignore accessing object property via bracket notation
    const data = store.getState().document.documentData[id]
    return data ? JSON.parse(JSON.stringify(data)) : null
  },
  children: function (id:string) {
    return JSON.parse(JSON.stringify(dataStore.getChildren(id)))
  },
  moveBefore: function (id:string, beforeId:string) {
    store.dispatch(moveBefore([id, beforeId]))
  },
  moveAfter: function (id:string, afterId:string) {
    store.dispatch(moveAfter([id, afterId]))
  },
  appendTo: function (id:string, parentId:string) {
    store.dispatch(appendTo([id, parentId, dataStore.getLastOrderIndex(parentId)]))
  },
  clone: function (id:string, parent:string, unChangeOrder:number) {
    const cloneId = createKey()
    store.dispatch(clone([id, cloneId, parent, unChangeOrder]))
    return this.get(cloneId)
  },
  copy: function (id:string) {
    // disabling lint, because children array can contain any element object with different properties
    const children:any[] = [] // eslint-disable-line
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
  getDescendants: function (id:string, descendantData = {}) {
    const element = this.get(id)
    if (!element) {
      return false
    }

    // @ts-ignore accessing object property via bracket notation
    descendantData[id] = element

    dataStore.getChildren(id).forEach((child) => {
      this.getDescendants(child.id, descendantData)
    })

    return descendantData
  },
  all: function () {
    return JSON.parse(JSON.stringify(store.getState().document.documentData))
  },
  // disabling lint, because data can be any element object with different properties
  reset: function (data:any) { // eslint-disable-line
    store.dispatch(reset(data))
  },
  size: function () {
    return Object.keys(store.getState().document.documentData).length
  },
  filter: function (callback:() => void) {
    const data = store.getState().document.documentData
    return Object.keys(data).map((key) => {
      // @ts-ignore accessing object property via bracket notation
      return JSON.parse(JSON.stringify(data[key])) // disabling lint, because data can be any element object with different properties
    }).filter(callback)
  },
  getTopParent: function (id:string):string {
    const obj = this.get(id)
    return obj && obj.parent ? this.getTopParent(obj.parent) : id
  },
  getByTag: function (tag:string) {
    const itemsByTag = {}
    const data = store.getState().document.documentData
    Object.keys(data).forEach((key) => {
      // @ts-ignore accessing object property via bracket notation
      if (data[key].tag === tag) {
        // @ts-ignore accessing object property via bracket notation
        itemsByTag[key] = JSON.parse(JSON.stringify(data[key]))
      }
    })
    return itemsByTag
  }
}

vcCake.addService('document', api)
