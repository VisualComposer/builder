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
      prevElementPath: []
    }

    this.findElement = this.findElement.bind(this)
  }

  findElement (e) {
    if (e.target !== this.prevTarget) {
      this.prevTarget = e.target
      // get all vcv elements
      let elPath = e.path.filter((el) => {
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
            element: this.prevElement,
            path: this.prevElementPath
          })
        }
        // set new element
        if (element) {
          this.api.request('editorContent:element:mouseEnter', {
            element: element,
            path: elPath
          })
        }
        this.prevElement = element
        this.prevElementPath = elPath
      }
    }
  }

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
  }

  init () {
    this.setup()
    this.api.reply('editorContent:element:mouseEnter', (data) => {
      this.controlsHandler.showOutline(data.element)
    })
    this.api.reply('editorContent:element:mouseLeave', (data) => {
      this.controlsHandler.hideOutline(data.element)
    })
    this.api.reply('treeContent:element:mouseEnter', (id) => {
      let element = this.iframeDocument.querySelector(`[data-vcv-element="${id}"]`)
      // console.log(element)
      if (element) {
        this.controlsHandler.showOutline(element)
      }
    })
  }
}

