import vcCake from 'vc-cake'
import ControlsHandler from './wipControlsHandler'
import OutlineHandler from './outline'
import FramesHandler from './frames'

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
      showFrames: true,
      showControls: true
    }

    this.findElement = this.findElement.bind(this)
  }

  /**
   * Setup
   */
  setup (options) {
    Object.defineProperties(this, {
      /**
       * @memberOf! ControlsManager
       */
      controls: {
        value: new ControlsHandler(this.api, options.framesCount),
        writable: false,
        enumerable: false,
        configurable: false
      },

      /**
       * @memberOf! OutlineManager
       */
      outline: {
        value: new OutlineHandler(),
        writable: false,
        enumerable: false,
        configurable: false
      },

      /**
       * @memberOf! FramesManager
       */
      frames: {
        value: new FramesHandler(options.framesCount),
        writable: false,
        enumerable: false,
        configurable: false
      }
    })

    // this.api.request(event, elementId, options)
    this.iframeDocument.body.addEventListener('mousemove', this.findElement)
    // this.iframeDocument.addEventListener('mouseenter', this.findElement)
    // this.iframeDocument.addEventListener('mouseleave', this.findElement)
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
      let path = this.getPath(e)
      let elPath = path.filter((el) => {
        return el.dataset && el.dataset.hasOwnProperty('vcvElement')
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
            path: this.prevElementPath,
            vcElementsPath: this.prevElementPath.map((el) => {
              return el.dataset.vcvElement
            })
          })
        }
        // set new element
        if (element) {
          this.api.request('editorContent:element:mouseEnter', {
            type: 'mouseEnter',
            element: element,
            vcElementId: element.dataset.vcvElement,
            path: elPath,
            vcElementsPath: elPath.map((el) => {
              return el.dataset.vcvElement
            })
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
   * Initialize
   */
  init () {
    this.setup({ framesCount: 3 })

    // Check custom layout mode
    vcCake.onDataChange('vcv:layoutCustomMode', (state) => {
      this.state.showOutline = !state
      this.state.showFrames = !state
      this.state.showControls = !state
      this.findElement()
    })

    // check remove element
    this.api.reply('data:remove', () => {
      this.findElement()
    })

    // Interact with content
    // Controls interaction
    this.api.reply('editorContent:element:mouseEnter', (data) => {
      if (this.state.showControls) {
        this.controls.show(data)
      }
    })
    this.api.reply('editorContent:element:mouseLeave', () => {
      this.controls.hide()
    })

    // Frames interaction
    this.api.reply('editorContent:element:mouseEnter', (data) => {
      if (this.state.showFrames) {
        this.frames.show({ element: data.element, path: data.path })
      }
    })
    this.api.reply('editorContent:element:mouseLeave', () => {
      this.frames.hide()
    })

    // Interact with tree
    this.api.reply('treeContent:element:mouseEnter', (id) => {
      if (this.state.showOutline) {
        let element = this.iframeDocument.querySelector(`[data-vcv-element="${id}"]`)
        if (element) {
          this.outline.show(element)
        }
      }
    })
    this.api.reply('treeContent:element:mouseLeave', () => {
      this.outline.hide()
    })
  }
}

