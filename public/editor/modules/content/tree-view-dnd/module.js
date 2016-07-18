import vcCake from 'vc-cake'
vcCake.add('content-tree-view-dnd', function (api) {
  const DnD = require('./../frame-based-dnd/lib/dnd')
  const ModuleDnd = function (api) {
    this.api = api
    this.layoutAPI = this.api.module('ui-tree-view')
  }
  ModuleDnd.prototype.buildItems = function () {
    if (!this.items) {
      this.items = new DnD(document.querySelector('.vcv-ui-tree-layout'), {
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this),
        document: document
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
    this.items.addItem(id, document)
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
    document.body.classList.add('vcv-no-select')
  }
  ModuleDnd.prototype.end = function () {
    this.api.module('content-editor-controls-iframe').do('hideFrame', true)
    this.api.module('content-editor-controls').do('enableControls', true)
    document.body.classList.remove('vcv-no-select')
  }
  var dnd = new ModuleDnd(api)
  dnd.init()
})
