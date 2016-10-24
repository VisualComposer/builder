import vcCake from 'vc-cake'
import DnD from '../../../../resources/dnd/dnd'

vcCake.add('content-tree-view-dnd', function (api) {
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
        document: document,
        container: document.body,
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
  }
  ModuleDnd.prototype.move = function (id, action, related) {
    if (id && related) {
      this.api.request('data:move', id, { action: action, related: related })
    }
  }
  ModuleDnd.prototype.start = function () {
    this.api.module('content-editor-controls-iframe').do('disableControls', true)
    document.body.classList.add('vcv-is-no-selection')
    // this.api.notify('draggingStarted', true)
  }
  ModuleDnd.prototype.end = function () {
    // vcCake.setData('vcv:layoutCustomMode', null)
    // this.api.module('content-editor-controls-iframe').do('hideFrame', true)
    this.api.module('content-editor-controls-iframe').do('disableControls', false)
    document.body.classList.remove('vcv-is-no-selection')
    // this.api.notify('draggingEnd', false)
  }
  let dnd = new ModuleDnd(api)
  dnd.init()
})
