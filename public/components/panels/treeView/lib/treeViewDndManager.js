import vcCake from 'vc-cake'
import DnD from '../../../dnd/dndDataSet'
const workspaceStorage = vcCake.getStorage('workspace')

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
      },
      sidebarContent: {
        value: document.querySelector('.vcv-layout-bar-content'),
        writable: false,
        enumerable: false,
        configurable: true
      }
    })
  }

  buildItems (isAttribute = false) {
    const scrollContainerSelector = isAttribute ? '.vcv-ui-edit-form-section-content .vcv-ui-tree-layout-container .vcv-ui-scroll-content' : '.vcv-ui-tree-layout-container .vcv-ui-scroll-content'
    const containerSelector = isAttribute ? '.vcv-ui-edit-form-section-content .vcv-ui-tree-layout' : '.vcv-ui-tree-layout'
    if (!this.items) {
      this.scrollContainer = document.querySelector(scrollContainerSelector)
      this.items = new DnD(document.querySelector(containerSelector), {
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this),
        document: document,
        container: document.getElementById('vcv-layout'),
        handler: '> .vcv-ui-tree-layout-control .vcv-ui-tree-layout-control-drag-handler',
        helperType: 'clone',
        customScroll: true,
        scrollContainer: this.scrollContainer,
        scrollCallback: this.scrollTo.bind(this),
        isAttribute: isAttribute
      })
      this.items.init()
    }
  }

  scrollTo (point) {
    this.scroll = false
    if (point.end) {
      return
    }
    if (!this.sidebarContent || !this.scrollContainer) {
      return
    }
    const scrollContainer = this.scrollContainer.getBoundingClientRect()
    let step = 0
    if (point.y - scrollContainer.top <= 50) {
      step = -4
    } else if (scrollContainer.height + scrollContainer.top <= point.y + 50) {
      step = 4
    }
    if (step) {
      this.scroll = true
      this.scrollContent(step)
    }
  }

  scrollContent (step) {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = null
    }
    if (this.scroll) {
      const posY = this.scrollContainer && (this.scrollContainer.scrollY || this.scrollContainer.scrollTop)
      const posX = this.scrollContainer && (this.scrollContainer.scrollX || this.scrollContainer.scrollLeft)
      if (posY === undefined || posX === undefined) {
        return
      }
      this.scrollContainer.scroll ? this.scrollContainer.scroll(posX, posY + step) : this.scrollContainer.scrollTop = posY + step
      this.scrollTimeout = setTimeout(() => {
        this.scrollContent(step)
      }, 30)
    }
  }

  getOffsetTop () {
    if (this.iframe) {
      const rect = this.iframe.getBoundingClientRect()
      return rect.top
    }
    return 0
  }

  updateOffsetTop () {
    this.items.option('offsetTop', this.getOffsetTop())
  }

  removeItems () {
    this.items = null
    workspaceStorage.state('navbarPosition').ignoreChange(this.updateOffsetTop.bind(this))
  }

  add (id, isAttribute) {
    this.buildItems(isAttribute)
    this.items.addItem(id, this.documentDOM)
  }

  remove (id, isAttribute) {
    this.buildItems(isAttribute)
    this.items.removeItem(id)
    window.setTimeout(() => {
      if (!document.querySelector('.vcv-ui-tree-layout')) {
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
