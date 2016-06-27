var vcCake = require('vc-cake')
const $ = require('jquery')

vcCake.add('content-atolls-dnd', function (api) {
  require('./css/module.less')
  const AtollsDnD = require('./lib/atolls-dnd')
  const ModuleDnd = function (api) {
    this.layoutAPI = api.module('content-layout')
    this.atolls = null
  }
  ModuleDnd.prototype.buildAtolls = function () {
    if (this.atolls === null) {
      let iframe = document.getElementById('vcv-editor-iframe')
      let offsetTop = $(iframe).offset().top
      let documentDOM = iframe.contentWindow.document
      this.atolls = new AtollsDnD(documentDOM.querySelector('[data-vcv-module="content-layout"]'), {
        radius: false,
        cancelMove: true,
        moveCallback: this.move.bind(this),
        documentDOM: documentDOM,
        offsetTop: offsetTop
      })
      this.atolls.init()
    }
  }
  ModuleDnd.prototype.init = function () {
    this.layoutAPI
      .on('element:mount', this.add.bind(this))
      .on('element:unmount', this.remove.bind(this))
  }
  ModuleDnd.prototype.add = function (id) {
    this.buildAtolls()
    this.atolls.addItem(id)
  }
  ModuleDnd.prototype.remove = function (id) {
    this.buildAtolls()
    this.atolls.removeItem(id)
  }
  ModuleDnd.prototype.move = function (id, action, related) {
    console.log(id, action, related)
    api.request('data:move', id, { action: action, related: related })
  }
  let dnd = new ModuleDnd(api)
  dnd.init()
})
