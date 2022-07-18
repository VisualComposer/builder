import vcCake from 'vc-cake'
import DndDataSet from 'public/components/dnd/dndDataSet'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const cook = vcCake.getService('cook')
const elementsStorage = vcCake.getStorage('elements')
const documentManager = vcCake.getService('document')
const dataManager = vcCake.getService('dataManager')
const roleManager = vcCake.getService('roleManager')

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
      if (this.iframe) {
        this.documentDOM = this.iframe.contentWindow.document
      }
      const container = this.documentDOM.querySelector('[data-vcv-module="content-layout"]')
      if (container) {
        const DndConstructor = DndDataSet
        let ignoreHandling = null
        if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())) {
          ignoreHandling = '[data-vcv-element-locked]'
        }
        this.items = new DndConstructor(container, {
          cancelMove: true,
          moveCallback: this.move.bind(this),
          dropCallback: this.drop.bind(this),
          startCallback: DndManager.start,
          endCallback: DndManager.end,
          window: this.iframe.contentWindow || window,
          document: this.documentDOM || document,
          container: document.getElementById('vcv-editor-iframe-overlay') || document.body,
          wrapper: document.querySelector('.vcv-layout-iframe-wrapper'),
          manualScroll: true,
          ignoreHandling: ignoreHandling
        })
        this.items.init()
        this.apiDnD = this.items.api
        this.apiDnD.start = this.apiDnD.start.bind(this.apiDnD)
        this.apiDnD.addNew = this.apiDnD.addNew.bind(this.apiDnD)
        vcCake.onDataChange('draggingElement', this.apiDnD.start)
        vcCake.onDataChange('dropNewElement', this.apiDnD.addNew)
        workspaceStorage.state('navbarPosition').onChange(this.updateOffsetTop.bind(this))
        vcCake.onDataChange('vcv:layoutCustomMode', (data) => {
          if (data && (data.mode === 'contentEditable' || data.mode === 'columnResizer' || data.mode === 'headerDrop' || data.mode === 'elementResize')) {
            this.items.option('disabled', true)
            this.items.handleDragEnd()
          } else {
            this.items.option('disabled', false)
            this.items.option('manualScroll', true)
          }
        })
        workspaceIFrame.onChange(this.unSubscribe.bind(this))
      }
    }
  }

  rebuildItems () {
    this.items = null
    this.buildItems()
  }

  removeItems () {
    this.items = null
    workspaceStorage.state('navbarPosition').ignoreChange(this.updateOffsetTop.bind(this))
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

  init () {
    this.api
      .on('element:mount', this.initItems.bind(this))
      .on('element:unmount', this.remove.bind(this))
      .on('element:didUpdate', this.initItems.bind(this))
      .on('editor:mount', this.rebuildItems.bind(this))
  }

  unSubscribe ({ type }) {
    if (type === 'reload') {
      workspaceIFrame.ignoreChange(this.unSubscribe.bind(this))
      this.api
        .off('element:mount', this.initItems.bind(this))
        .off('element:unmount', this.remove.bind(this))
        .off('element:didUpdate', this.initItems.bind(this))
        .off('editor:mount', this.rebuildItems.bind(this))
      vcCake.ignoreDataChange('draggingElement', this.apiDnD.start)
      vcCake.ignoreDataChange('dropNewElement', this.apiDnD.addNew)
      workspaceStorage.state('navbarPosition').ignoreChange(this.updateOffsetTop.bind(this))
    }
  }

  initItems (id) {
    console.log(id)
    const cookElement = cook.getById(id)
    const isDraggable = cookElement.get('metaIsDraggable')
    if (isDraggable === undefined || isDraggable) {
      this.buildItems()
      this.items.addItem(id, this.documentDOM)
    }
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

  move (id, action, related) {
    if (id && related) {
      if (related === 'vcv-ui-blank-row') {
        DndManager.handleBlankRowDrop(id, action)
      } else {
        workspaceStorage.trigger('move', id, { action: action, related: related })
      }
    }
  }

  drop (id, action, related, draggingElement, elementData, options) {
    if (id && related) {
      if (related === 'vcv-ui-blank-row') {
        DndManager.handleBlankRowDrop(id, action, elementData)
      } else {
        workspaceStorage.trigger('drop', id, { action, related, element: elementData, options })
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

  static handleBlankRowDrop (id, action, element) {
    const elementSettings = documentManager.get(id)
    if (!elementSettings) { // Drop from addElement window
      element = cook.get(element).toJS()
      element.parent = false
      elementsStorage.trigger('add', element)
      workspaceStorage.trigger('edit', element.id, '')
    } else { // Drop existing element
      const parentWrapper = cook.get(elementSettings).get('parentWrapper')
      const wrapperTag = parentWrapper === undefined ? 'column' : parentWrapper
      const editorType = dataManager.get('editorType')

      if (editorType === 'popup' && !wrapperTag) { // Append dragging element after last root element without wrapper
        const rootElements = documentManager.children(false)
        const lastRootElement = rootElements[rootElements.length - 1]
        workspaceStorage.trigger('move', id, { action: 'append', related: lastRootElement.id })
      } else if (wrapperTag) { // Add wrapper and insert dragging element into this wrapper
        const wrapper = cook.get({ tag: wrapperTag }).toJS()
        elementsStorage.trigger('add', wrapper, true, { skipInitialExtraElements: true })
        workspaceStorage.trigger('move', id, { action: 'append', related: wrapper.id })
      } else { // Move dragging element at the end without creating wrapper
        const rootElements = documentManager.children(false)
        const lastRootElement = rootElements[rootElements.length - 1]
        workspaceStorage.trigger('move', id, { action: 'after', related: lastRootElement.id })
      }
    }
  }
}
