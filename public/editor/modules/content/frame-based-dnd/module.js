/* global $ */
import Api from './lib/api'
import vcCake from 'vc-cake'
import DnD from './lib/dnd'

require('./css/module.less')
vcCake.add('content-frame-based-dnd', function (api) {
  var documentDOM
  var offsetTop
  var offsetLeft
  var ModuleDnd = function (moduleApi) {
    this.api = moduleApi
    this.layoutAPI = this.api.module('content-layout')
  }
  ModuleDnd.prototype.buildItems = function () {
    if (!this.items) {
      var iframe = $('#vcv-editor-iframe')
      if (!documentDOM && iframe.get(0)) {
        documentDOM = iframe.get(0).contentWindow.document
        offsetTop = iframe.offset().top
      } else {
        documentDOM = document
      }
      this.items = new DnD(documentDOM.querySelector('[data-vcv-module="content-layout"]'), {
        radius: 350,
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this),
        document: documentDOM,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft
      })
      this.items.init()
      this.dndApi = new Api(this.items, this.api)
    }
  }
  ModuleDnd.prototype.init = function () {
    this.layoutAPI
      .on('element:mount', this.add.bind(this))
      .on('element:unmount', this.remove.bind(this))
  }
  ModuleDnd.prototype.add = function (id) {
    this.buildItems()
    this.items.addItem(id, documentDOM)
  }
  ModuleDnd.prototype.remove = function (id) {
    this.buildItems()
    this.items.removeItem(id)
  }
  ModuleDnd.prototype.move = function (id, action, related) {
    if (id && related) {
      this.api.request('data:move', id, { action: action, related: related })
    }
  }
  ModuleDnd.prototype.start = function () {
    this.api.module('content-editor-controls-iframe').do('disableControls', true)
  }
  ModuleDnd.prototype.end = function () {
    this.api.module('content-editor-controls-iframe').do('disableControls', false)
  }
  var dnd = new ModuleDnd(api)
  dnd.init()
})
