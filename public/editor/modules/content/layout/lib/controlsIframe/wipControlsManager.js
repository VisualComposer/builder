import vcCake from 'vc-cake'
import ControlsHandler from './wipControlsHandler'

require('../../css/controls/init.less')
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
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeDocument = this.iframe && this.iframe.contentWindow.document
    this.state = {
      prevTarget: null,
      prevElement: null,
      prevElementPath: [],
      showOutline: true,
      showFrames: true
    }

    this.findElement = this.findElement.bind(this)
  }

  /**
   * Find element by event and run cake events on element over and out
   * @param e
   */
  findElement (e = null) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    if (e.target !== this.prevTarget) {
      this.prevTarget = e.target
      // get all vcv elements
      let path = e.path || this.getPath(e)
      let elPath = path.filter((el) => {
        if (el.dataset && el.dataset.hasOwnProperty('vcvElement')) {
          return true
        }
        return false
      })
      let element = null
      if (elPath.length) {
        element = elPath[ 0 ] // first element in path always hovered element
      }
      if (this.prevElement !== element) {
        // unset prev element
        if (this.prevElement) {
          this.api.request('editorContent:element:mouseLeave', {
            type: 'mouseLeave',
            element: this.prevElement,
            vcElementId: this.prevElement.dataset.vcvElement,
            path: this.prevElementPath
          })
        }
        // set new element
        if (element) {
          this.api.request('editorContent:element:mouseEnter', {
            type: 'mouseEnter',
            element: element,
            vcElementId: element.dataset.vcvElement,
            path: elPath
          })
        }

        this.prevElement = element
        this.prevElementPath = elPath
      }
    }
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
   * Setup
   */
  setup () {
    Object.defineProperties(this, {
      /**
       * @memberOf! ControlsManager
       */
      controlsHandler: {
        value: new ControlsHandler(),
        writable: false,
        enumerable: false,
        configurable: false
      },
      /**
       * @memberOf! ControlsManager
       */
      hideControls: {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true
      }
    })

    // this.api.request(event, elementId, options)
    this.iframeDocument.body.addEventListener('mousemove', this.findElement)
    this.iframeDocument.addEventListener('mouseenter', this.findElement)
    this.iframeDocument.addEventListener('mouseleave', this.findElement)
  }

  /**
   * Initialize
   */
  init () {
    this.setup()

    // Check custom layout mode
    vcCake.onDataChange('vcv:layoutCustomMode', (state) => {
      this.state.showOutline = !state
      this.state.showFrames = !state
      this.findElement()
    })

    // Interact with content
    // Outline interaction
    // this.api.reply('editorContent:element:mouseEnter', (data) => {
    //   if (this.state.showOutline) {
    //     this.controlsHandler.showOutline(data.element)
    //   }
    // })
    // this.api.reply('editorContent:element:mouseLeave', (data) => {
    //   this.controlsHandler.hideOutline()
    // })

    // Frames interaction
    this.api.reply('editorContent:element:mouseEnter', (data) => {
      if (this.state.showFrames) {
        this.controlsHandler.showFrames({ element: data.element, path: data.path })
      }
    })
    this.api.reply('editorContent:element:mouseLeave', () => {
      this.controlsHandler.hideFrames()
    })

    // Interact with tree
    this.api.reply('treeContent:element:mouseEnter', (id) => {
      if (this.state.showOutline) {
        let element = this.iframeDocument.querySelector(`[data-vcv-element="${id}"]`)
        if (element) {
          this.controlsHandler.showOutline(element)
        }
      }
    })
    this.api.reply('treeContent:element:mouseLeave', () => {
      this.controlsHandler.hideOutline()
    })
  }
}

