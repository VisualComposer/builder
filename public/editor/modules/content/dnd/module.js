import vcCake from 'vc-cake'
import DnD from '../../../../resources/dnd/dnd'
import $ from 'jquery'

require('./css/init.less')
vcCake.add('content-dnd', function (api) {
  let documentDOM
  let iframe
  const ModuleDnd = function (moduleApi) {
    this.api = moduleApi
    this.layoutAPI = this.api.module('content-layout')
  }
  ModuleDnd.prototype.buildItems = function () {
    if (!this.items) {
      iframe = $('#vcv-editor-iframe')
      if (!documentDOM && iframe.get(0)) {
        documentDOM = iframe.get(0).contentWindow.document
      }
      this.items = new DnD(documentDOM.querySelector('[data-vcv-module="content-layout"]'), {
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this),
        document: documentDOM || document,
        container: document.getElementById('vcv-editor-iframe-overlay') || document.body
      })
      this.items.init()
      this.apiDnD = DnD.api(this.items)
      this.api.addAction('startDragging', this.apiDnD.start.bind(this.apiDnD))
      this.api.module('ui-navbar').on('positionChanged', this.updateOffsetTop.bind(this))
      vcCake.onDataChange('vcv:layoutCustomMode', (value) => {
        this.items.option('disabled', value === 'contentEditable')
      })
    }
  }
  ModuleDnd.prototype.getOffsetTop = function () {
    return iframe ? iframe.offset().top : 0
  }
  ModuleDnd.prototype.updateOffsetTop = function () {
    this.items.option('offsetTop', this.getOffsetTop())
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
