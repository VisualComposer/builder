var vcCake = require('vc-cake')
vcCake.add('tree-view-dnd', function (api) {
  var DnD = require('./../frame-based-dnd/lib/dnd')
  var documentDOM
  var offsetTop
  var offsetLeft
  var ModuleDnd = function (api) {
    this.api = api
    this.layoutAPI = this.api.module('ui-tree-layout')
  }
  ModuleDnd.prototype.buildItems = function () {
    if (!this.items) {
      documentDOM = document
      this.items = new DnD(documentDOM.querySelector('.vcv-ui-tree-layout'), {
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
    this.api.module('content-editor-controls').do('enableControls', false)
  }
  ModuleDnd.prototype.end = function () {
    this.api.module('content-editor-controls').do('enableControls', true)
  }
  var dnd = new ModuleDnd(api)
  dnd.init()
})
