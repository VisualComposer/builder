import {addService, setData, getData, getService} from 'vc-cake'

const utils = getService('utils')
addService('myTemplates', {
  add (name, data) {
    let myTemplates = this.all()
    let id = utils.createKey()
    if (this.findBy('name', name)) {
      return false
    }
    myTemplates.push({ id: id, name: name, data: data })
    setData('myTemplates', myTemplates)
    return id
  },
  remove (id) {
    let myTemplates = this.all()
    let removeIndex = myTemplates.findIndex((template) => {
      return template.id === id
    })
    myTemplates.splice(removeIndex, 1)
    setData('myTemplates', myTemplates)
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
    let getType = {}.toString
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
