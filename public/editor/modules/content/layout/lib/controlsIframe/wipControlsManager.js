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
    this.controlElementFind = this.controlElementFind.bind(this)
  }

  /**
   * Setup
   */
  setup (options) {
    Object.defineProperties(this, {
      /**
       * @memberOf! FramesManager
       */
      frames: {
        value: new FramesHandler(options.framesCount),
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
       * @memberOf! ControlsManager
       */
      controls: {
        value: new ControlsHandler(options.framesCount),
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
      this.controlElementFind()
    })

    // check remove element
    this.api.reply('data:remove', () => {
      this.findElement()
      this.controlElementFind()
    })

    // Interact with content
    this.interactWithContent()

    // Interact with tree
    this.interactWithTree()

    // interact with controls
    this.interactWithControls()
  }

  interactWithContent () {
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
  }

  interactWithTree () {
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

  interactWithControls () {
    // click on action
    this.controls.getControlsContainer().addEventListener('click',
      (e) => {
        e && e.button === 0 && e.preventDefault()
        if (e.button === 0) {
          let path = this.getPath(e)
          // search for event
          let i = 0
          let el = null
          while (i < path.length && path[ i ] !== this.controls.getControlsContainer()) {
            if (path[ i ].dataset && path[ i ].dataset.vcControlEvent) {
              el = path[ i ]
              i = path.length
            }
            i++
          }
          if (el) {
            let event = el.dataset.vcControlEvent
            let options = el.dataset.vcControlEventOptions
            let elementId = el.dataset.vcvElementId
            this.api.request(event, elementId, options)
          }
        }
      }
    )
    // drag control
    this.controls.getControlsContainer().addEventListener('mousedown',
      (e) => {
        e && e.button === 0 && e.preventDefault()
        if (e.button === 0) {
          let path = this.getPath(e)
          // search for event
          let i = 0
          let el = null
          while (i < path.length && path[ i ] !== this.controls.getControlsContainer()) {
            if (path[ i ].dataset && path[ i ].dataset.vcDragHelper) {
              el = path[ i ]
              i = path.length
            }
            i++
          }
          if (el) {
            vcCake.setData('draggingElement', { id: el.dataset.vcDragHelper, point: { x: e.clientX, y: e.clientY } })
          }
        }
      }
    )

    // add controls interaction with content
    if (!this.hasOwnProperty('controlsPrevTarget')) {
      this.controlsPrevTarget = null
    }
    if (!this.hasOwnProperty('controlsPrevElement')) {
      this.controlsPrevElement = null
    }
    this.controls.getControlsContainer().addEventListener('mousemove', this.controlElementFind)
    this.controls.getControlsContainer().addEventListener('mouseleave', this.controlElementFind)
  }

  controlElementFind (e) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    if (e.target !== this.controlsPrevTarget) {
      this.controlsPrevTarget = e.target
      // get all vcv elements
      let path = this.getPath(e)
      // search for event
      let i = 0
      let element = null
      while (i < path.length && path[ i ] !== this.controls.getControlsContainer()) {
        if (path[ i ].dataset && path[ i ].dataset.vcDragHelper) {
          element = path[ i ].dataset.vcDragHelper
          i = path.length
        }
        i++
      }
      if (this.controlsPrevElement !== element) {
        // unset prev element
        if (this.controlsPrevElement) {
          // remove highlight from tree view
          this.api.request('editorContent:control:mouseLeave', {
            type: 'mouseLeave',
            vcElementId: this.controlsPrevElement
          })
          // hide ouutline from tree element
          this.outline.hide()
        }
        // set new element
        if (element) {
          if (this.state.showOutline) {
            // highlight tree view
            this.api.request('editorContent:control:mouseEnter', {
              type: 'mouseEnter',
              vcElementId: element
            })
            // show outline over content element
            let contentElement = this.iframeDocument.querySelector(`[data-vcv-element="${element}"]`)
            if (contentElement) {
              this.outline.show(contentElement)
            }
          }
        }

        this.controlsPrevElement = element
      }
    }
  }
}

