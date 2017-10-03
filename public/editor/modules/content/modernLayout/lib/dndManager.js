import vcCake from 'vc-cake'
import DnD from '../../../../../resources/dnd/dnd'
import DndDataSet from '../../../../../resources/dndUpdate/dndDataSet'

const workspaceStorage = vcCake.getStorage('workspace')

export default class DndManager {
  constructor (api) {
    Object.defineProperties(this, {
      /**
       * @memberOf! DndManager
       */
      api: {
        value: api,
        writable: false,
        enumerable: false,
        configurable: false
      },
      /**
       * @memberOf! DndManager
       */
      iframe: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: true
      },
      /**
       * @memberOf! DndManager
       */
      documentDOM: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: true
      },
      /**
       * @memberOf! DndManager
       */
      items: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: true
      }
    })
  }

  buildItems () {
    if (!this.items) {
      this.iframe = document.getElementById('vcv-editor-iframe')
      if (!this.documentDOM && this.iframe) {
        this.documentDOM = this.iframe.contentWindow.document
      }
      const DndConstructor = vcCake.env('FIX_DND_FOR_TABS') ? DndDataSet : DnD
      this.items = new DndConstructor(this.documentDOM.querySelector('[data-vcv-module="content-layout"]'), {
        cancelMove: true,
        moveCallback: this.move.bind(this),
        dropCallback: this.drop.bind(this),
        startCallback: DndManager.start,
        endCallback: DndManager.end,
        document: this.documentDOM || document,
        container: document.getElementById('vcv-editor-iframe-overlay') || document.body,
        manualScroll: true
      })
      this.items.init()
      this.apiDnD = DndConstructor.api(this.items)
      vcCake.onDataChange('draggingElement', this.apiDnD.start.bind(this.apiDnD))
      vcCake.onDataChange('dropNewElement', this.apiDnD.addNew.bind(this.apiDnD))
      workspaceStorage.state('navbarPosition').onChange(this.updateOffsetTop.bind(this))
      vcCake.onDataChange('vcv:layoutCustomMode', (value) => {
        if (value === 'contentEditable' || value === 'columnResizer') {
          this.items.option('disabled', true)
          this.items.handleDragEnd()
        } else {
          this.items.option('disabled', false)
          this.items.option('manualScroll', true)
        }
      })
    }
  }

  removeItems () {
    this.items = null
    workspaceStorage.state('navbarPosition').ignoreChange(this.updateOffsetTop.bind(this))
  }

  getOffsetTop () {
    if (this.iframe) {
      let rect = this.iframe.getBoundingClientRect()
      return rect.top
    }
    return 0
  }

  updateOffsetTop () {
    this.items.option('offsetTop', this.getOffsetTop())
  }

  init () {
    this.api
      .on('element:mount', this.add.bind(this))
      .on('element:unmount', this.remove.bind(this))
      .on('element:didUpdate', this.update.bind(this))
  }

  add (id) {
    this.buildItems()
    this.items.addItem(id, this.documentDOM)
  }

  remove (id) {
    this.buildItems()
    this.items.removeItem(id)
    window.setTimeout(() => {
      if (!this.documentDOM.querySelector('[data-vcv-module="content-layout"]')) {
        this.removeItems()
      }
    }, 0)
  }

  update (id) {
    this.buildItems()
    this.items.updateItem(id, this.documentDOM)
  }

  move (id, action, related) {
    if (id && related) {
      if (vcCake.env('DND_TRASH_BIN') && related === 'vcv-dnd-trash-bin') {
        workspaceStorage.trigger('remove', id)
      } else {
        workspaceStorage.trigger('move', id, { action: action, related: related })
      }
    }
  }

  drop (id, action, related, element) {
    if (id && related) {
      if (vcCake.env('DND_TRASH_BIN') && related === 'vcv-dnd-trash-bin') {
        workspaceStorage.trigger('remove', id)
      } else {
        workspaceStorage.trigger('drop', id, {action: action, related: related, element: element})
        // this.api.request('data:move', id, { action: action, related: related })
      }
    }
  }

  static start () {
    vcCake.setData('elementControls:disable', true)
    document.body.classList.add('vcv-is-no-selection')
  }

  static end () {
    vcCake.setData('elementControls:disable', false)
    document.body.classList.remove('vcv-is-no-selection')
  }
}
