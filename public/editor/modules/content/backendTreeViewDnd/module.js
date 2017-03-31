import vcCake from 'vc-cake'
import DnD from '../../../../resources/dnd/dnd'

vcCake.add('content-backend-tree-view-dnd', function (api) {
  const ModuleDnd = function (api) {
    this.api = api
    this.layoutAPI = this.api.module('ui-tree-view-backend')
  }
  ModuleDnd.prototype.buildItems = function () {
    if (!this.items) {
      this.items = new DnD(document.querySelector('.vcv-ui-tree-layout'), {
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this),
        document: document,
        container: document.getElementById('vcv-layout'),
        handler: '> .vcv-ui-tree-layout-control > .vcv-ui-tree-layout-control-drag-handler',
        helperType: 'clone'
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
    window.setTimeout(() => {
      if (!document.querySelector('.vcv-ui-tree-layout')) {
        this.items = null
      }
    }, 0)
  }
  ModuleDnd.prototype.move = function (id, action, related) {
    if (id && related) {
      this.api.request('data:move', id, { action: action, related: related })
    }
  }
  ModuleDnd.prototype.start = function () {
    document.body.classList.add('vcv-is-no-selection')
  }
  ModuleDnd.prototype.end = function () {
    document.body.classList.remove('vcv-is-no-selection')
  }
  let dnd = new ModuleDnd(api)
  dnd.init()
})
