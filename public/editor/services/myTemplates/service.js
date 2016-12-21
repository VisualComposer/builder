import {addService, setData, getData, getService} from 'vc-cake'

const utils = getService('utils')
const documentManager = getService('document')
let getType = {}.toString

addService('myTemplates', {
  add (name, data, successCallback, errorCallback) {
    const addAction = new Promise((resolve, reject) => {
      let myTemplates = this.all()
      let id = utils.createKey()
      if (this.findBy('name', name)) {
        reject({error: 'Wrong name'})
        return false
      }
      myTemplates.push({ id: id, name: name, data: data })
      resolve(id)
      setData('myTemplates', myTemplates)
    })
    addAction.then(successCallback, errorCallback)
    return true
  },
  addCurrentLayout (name, successCallback, errorCallback) {
    let currentLayout = documentManager.all()
    if (getType.call(name) === '[object String]' && name.length) {
      return this.add(name, currentLayout, successCallback, errorCallback)
    }
    return false
  },
  remove (id, successCallback, errorCallback) {
    const addAction = new Promise((resolve, reject) => {
      let myTemplates = this.all()
      let removeIndex = myTemplates.findIndex((template) => {
        return template.id === id
      })
      if (removeIndex > -1) {
        myTemplates.splice(removeIndex, 1)
        setData('myTemplates', myTemplates)
        return resolve(removeIndex)
      }
      reject({error: 'Wrong template'})
    })
    addAction.then(successCallback, errorCallback)
  },
  get (id) {
    let myTemplates = this.all()
    return myTemplates.find((template) => {
      return template.id === id
    })
  },
  findBy (key, value) {
    return this.all().find((template) => {
      return template[ key ] && template[ key ] === value
    })
  },
  all (filter = null, sort = null) {
    let myTemplates = getData('myTemplates') || []
    if (filter && getType.call(filter) === '[object Function]') {
      myTemplates = myTemplates.filter(filter)
    }
    if (sort && getType.call(sort) === '[object Function]') {
      myTemplates.sort(sort)
    } else if (sort === 'name') {
      myTemplates.sort((a, b) => {
        return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
      })
    }
    return myTemplates
  }
})
