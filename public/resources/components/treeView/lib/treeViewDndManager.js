import vcCake from 'vc-cake'
import DnD from '../../../dnd/dnd'
const workspaceStorage = vcCake.getStorage('workspace')

require('../../../../sources/less/content/layout/dnd/init.less')
export default class TreeViewDndManager {
  constructor () {
    Object.defineProperties(this, {
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

  add (id) {
    this.buildItems()
    this.items.addItem(id, this.documentDOM)
  }

  remove (id) {
    this.buildItems()
    this.items.removeItem(id)
  }
  update (id) {
    this.buildItems()
    this.items.updateItem(id, this.documentDOM)
  }
  move (id, action, related) {
    if (id && related) {
      workspaceStorage.trigger('move', id, { action: action, related: related })
    }
  }

  start () {
    document.body.classList.add('vcv-is-no-selection')
  }

  end () {
    document.body.classList.remove('vcv-is-no-selection')
  }
}
