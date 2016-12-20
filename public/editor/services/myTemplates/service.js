import {addService, setData, getData, getService} from 'vc-cake'

const utils = getService('utils')
const documentManager = getService('document')
let getType = {}.toString

let handleSaveRequest = (action, key, data, successCallback, errorCallback) => {
  let ajax = getService('utils').ajax

  return ajax({
    'vcv-action': `editorTemplates:${action}:adminNonce`,
    'vcv-nonce': window.vcvNonce,
    [key]: data
  }, (result) => {
    let response = JSON.parse(result.response)
    if (response && response.status) {
      successCallback && typeof successCallback === 'function' && successCallback(response)
    } else {
      errorCallback && typeof errorCallback === 'function' && errorCallback(response)
    }
  }, errorCallback)
}

addService('myTemplates', {
  add (name, data, html, successCallback, errorCallback) {
    if (this.findBy('name', name)) {
      return false
    }
    handleSaveRequest('create', 'vcv-template-data', encodeURIComponent(JSON.stringify({
      post_title: name,
      post_content: html,
      meta_input: {
        vcvEditorTemplateElements: data
      }
    })), (response) => {
      let id = response.status.toString()
      let myTemplates = this.all()
      myTemplates.unshift({ id: id, name: name, data: data, html: html })
      setData('myTemplates', myTemplates)
      successCallback && typeof successCallback === 'function' && successCallback()
    }, errorCallback)

    return true
  },
  addCurrentLayout (name, successCallback, errorCallback) {
    let currentLayout = documentManager.all()
    const iframe = document.getElementById('vcv-editor-iframe')
    const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
    let currentLayoutHtml = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
    if (getType.call(name) === '[object String]' && name.length) {
      return this.add(name, currentLayout, currentLayoutHtml, successCallback, errorCallback)
    }
    return false
  },
  remove (id, successCallback, errorCallback) {
    handleSaveRequest('delete', 'vcv-template-id', id, (response) => {
      let myTemplates = this.all()
      let removeIndex = myTemplates.findIndex((template) => {
        return template.id === id
      })
      myTemplates.splice(removeIndex, 1)
      setData('myTemplates', myTemplates)
      successCallback && typeof successCallback === 'function' && successCallback()
    }, errorCallback)
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
