import vcCake from 'vc-cake'

const layoutStorage = vcCake.getStorage('layout')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceContentStartState = workspaceStorage.state('contentStart')
const documentManager = vcCake.getService('document')

export default class ControlsManager {
  constructor (api) {
    Object.defineProperties(this, {
      /**
       * @memberOf! ControlsManager
       */
      api: {
        value: api,
        writable: false,
        enumerable: false,
        configurable: false
      }
    })
    this.editElement = this.editElement.bind(this)
  }

  /**
   * Setup
   */
  setup (options) {
    this.iframe = options.iframe
    this.iframeWindow = options.iframeWindow
    this.iframeDocument = options.iframeDocument
    this.editFormId = null

    // Subscribe to main event to interact with content elements
    this.iframeDocument.body.addEventListener('click', this.editElement)
  }

  /**
   * Initialize
   */
  init (options = {}) {
    let defaultOptions = {
      iframe: document.querySelector('#vcv-editor-iframe')
    }
    defaultOptions.iframeWindow = defaultOptions.iframe && defaultOptions.iframe.contentWindow
    defaultOptions.iframeDocument = defaultOptions.iframeWindow && defaultOptions.iframeWindow.document

    options = Object.assign({}, defaultOptions, options)
    this.setup(options)

    workspaceStorage.state('contentEnd').onChange((action) => {
      this.editFormId = null
      let data = workspaceStorage.state('settings').get()
      if (data && action === 'editElement' && data.element) {
        this.editFormId = data.element.id
      }
    })
  }

  /**
   * Event.path shadow dom polyfill
   * @param e
   * @returns {*}
   */
  getPath (e) {
    if (e.path) {
      return e.path
    }
    let path = []
    let node = e.target

    while (node) {
      path.push(node)
      node = node.parentNode
    }
    return path
  }

  /**
   * Find element
   */
  findElement (e = null) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    // get all vcv elements
    let path = this.getPath(e)
    let elPath = []
    path.forEach((el) => {
      if (el.hasAttribute && (el.hasAttribute('data-vcv-element') || el.hasAttribute('data-vcv-linked-element'))) {
        elPath.push(el)
      }
    })
    let element = null
    if (elPath.length) {
      element = elPath[ 0 ] // first element in path always hovered element
    }
    // replace linked element with real element
    if (element && element.dataset.hasOwnProperty('vcvLinkedElement')) {
      element = this.iframeDocument.querySelector(`[data-vcv-element="${element.dataset.vcvLinkedElement}"]`)
      elPath[ 0 ] = element
    }
    return element
  }

  editElement (e) {
    let element = this.findElement(e)
    if (this.editFormId) {
      let settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'edit') {
        workspaceStorage.state('settings').set(false)
      }
    } else if (element) {
      let elementData = documentManager.get(element.dataset.vcvElement)
      if (elementData) {
        this.editFormId = element.dataset.vcvElement
        workspaceStorage.trigger('edit', element.dataset.vcvElement, elementData.tag)
        if (workspaceContentStartState.get() === 'treeView') {
          workspaceContentStartState.set('treeView', element.dataset.vcvElement)
        }
      }
    }
    // remove treeView outline bug on mobile
    layoutStorage.state('userInteractWith').set(false)
  }
}
