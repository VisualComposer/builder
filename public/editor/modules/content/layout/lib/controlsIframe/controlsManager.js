import vcCake from 'vc-cake'
import $ from 'jquery'
import ControlsHandler from 'imports?$=jquery!./controlsHandler.js'

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
      },
      /**
       * @memberOf! ControlsManager
       */
      removeControls: {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      },
      /**
       * @memberOf! ControlsManager
       */
      removeControlsInterval: {
        value: 0,
        writable: true,
        enumerable: true,
        configurable: true
      }
    })
    vcCake.onDataChange('elementsControls:disable', (state) => {
      this.hideControls = !!state
      if (this.hideControls) {
        this.controlsHandler.removeControls()
      }
    })
    vcCake.onDataChange('layoutCustomMode', (value) => {
      if (value) {
        this.controlsHandler.hideOutline()
        this.controlsHandler.removeControls()
      } else {
        this.controlsHandler.drawOutlines()
        this.controlsHandler.setControlsPosition()
        this.controlsHandler.setTimer()
      }
    })
    window.clearInterval(this.removeControlsInterval)
    this.removeControlsInterval = window.setInterval(() => {
      if (this.removeControls) {
        this.controlsHandler.hideOutline()
      }
    }, 200)
  }

  init () {
    this.setup()
    var editorWrapper = document.getElementById('vcv-editor-iframe-overlay')
    var controlsWrapper = document.createElement('div')
    controlsWrapper.setAttribute('id', 'vcv-ui-controls-container')
    editorWrapper.appendChild(controlsWrapper)

    this.api.reply('start', () => {
      var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
      var $iframeDocument = $(iframeDocument)
      $iframeDocument.on('mousemove hover', '[data-vcv-element]', this.triggerShowFrame.bind(this))
      $iframeDocument.on('mousemove hover', 'body', this.triggerHideFrame.bind(this))
      $(document).on('mousemove hover', '.vcv-ui-outline-controls-container', (e) => {
        this.removeControls = false
        e.stopPropagation()
      })
      $(document).on('mousedown', '[data-vc-drag-helper]', (e) => {
        let id = $(e.currentTarget).data('vcDragHelper')
        if (id) {
          this.controlsHandler.removeControls()
          vcCake.setData('draggingElement', { id: id, point: { x: e.clientX, y: e.clientY } })
        }
      })
      $(document).on('click', '[data-vc-control-event]', (e) => {
        let $el = $(e.currentTarget)
        let event = $el.data('vcControlEvent')
        let options = $el.data('vcControlEventOptions')
        let elementId = $el.data('vcvElementId')
        e.preventDefault()
        this.api.request(event, elementId, options)
        event !== 'data:clone' && this.controlsHandler.hideOutline()
      })
      $(document).on('scroll resize', this.triggerRedrawFrame.bind(this))
      $(window).on('resize', this.triggerRedrawFrame.bind(this))
      $iframeDocument.on('scroll resize', this.triggerRedrawFrame.bind(this))
    })
  }

  triggerShowFrame (e) {
    this.removeControls = false
    e.stopPropagation()
    window.clearInterval(this.removeControlsInterval)
    this.removeControlsInterval = 0
    if (vcCake.getData('layoutCustomMode') === 'dnd') {
      this.hideControls = true
    }
    if (vcCake.getData('layoutCustomMode') !== 'contentEditable') {
      this.controlsHandler.showOutline($(e.currentTarget), this.hideControls)
    }
  }

  triggerHideFrame () {
    this.removeControls = true
    window.clearInterval(this.removeControlsInterval)
    this.removeControlsInterval = window.setInterval(function () {
      if (this.removeControls) {
        this.controlsHandler.hideOutline()
      }
    }, 200)
  }

  triggerRedrawFrame () {
    this.controlsHandler.drawOutlines()
    if (!vcCake.getData('layoutCustomMode')) {
      this.controlsHandler.setControlsPosition()
      this.controlsHandler.setTimer()
    }
  }
}

