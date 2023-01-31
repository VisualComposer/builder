import React from 'react'
import vcCake from 'vc-cake'
import striptags from 'striptags'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import initializeTinymce from 'public/components/layoutHelpers/tinymce/tinymceVcvHtmleditorPlugin'
import initializeJqueryPlugin from 'public/components/layoutHelpers/tinymce/fontFamily/tinymceFontsSelect.jquery'
import getUsedFonts from 'public/components/layoutHelpers/tinymce/fontFamily/getUsedFonts.js'
import { addShortcodeToQueueUpdate, updateHtmlWithServerRequest } from 'public/tools/updateHtmlWithServer'

const documentManager = vcCake.getService('document')
const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')
const { getShortcodesRegexp } = vcCake.getService('utils')

export default class ContentEditableComponent extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    fieldKey: PropTypes.string.isRequired,
    paramField: PropTypes.string,
    paramIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    fieldType: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string
    ]),
    className: PropTypes.string,
    options: PropTypes.object,
    cook: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.layoutHeader = document.querySelector('#vcv-layout-header')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document
    this.globalEditor = this.iframeWindow.tinymce
    this.state = {
      contentEditable: false,
      trackMouse: false,
      realContent: this.props.children,
      mouse: null,
      overlayTimeout: null,
      allowInline: this.props.options.allowInline,
      temporaryEditable: false
    }
    this.handleLayoutModeChange = this.handleLayoutModeChange.bind(this)
    this.handleGlobalClick = this.handleGlobalClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.updateElementData = this.updateElementData.bind(this)
    this.handleMoreButtonClick = this.handleMoreButtonClick.bind(this)
    this.handleEscapeClick = this.handleEscapeClick.bind(this)
    this.debouncedUpdateHtml = lodash.debounce(this.debouncedUpdateHtml, 500)

    // Request server only once in 3s
    this.debouncedUpdateHtmlWithServerRequest = lodash.debounce(this.debouncedUpdateHtmlWithServerRequest, 3000)
  }

  componentDidMount () {
    const initialText = '<h2>Typography is the art and technique</h2>\n' +
      '<p>Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed. The arrangement of type involves selecting typefaces, point size, line length, line-spacing (leading), letter-spacing (tracking), and adjusting the space within letters pairs (kerning).</p>'

    if (this.props.children === initialText) {
      this.debouncedUpdateHtml(this.props.children)
    } else {
      addShortcodeToQueueUpdate(this.props.children, this.ref, this.props.id)
    }
  }

  componentWillUnmount () {
    if (this.state.contentEditable) {
      this.iframeWindow.removeEventListener('click', this.handleGlobalClick)
      this.layoutHeader.removeEventListener('click', this.handleGlobalClick)
      this.iframeWindow.removeEventListener('click', this.handleEscapeClick)
      this.editor && this.editor.remove()
      this.removeOverlay()
    }
    vcCake.setData('vcv:layoutCustomMode', null)
  }

  componentDidUpdate (prevProps) {
    if (!lodash.isEqual(prevProps, this.props)) {
      if (this.state.contentEditable !== true && this.props.children !== this.state.realContent) {
        this.setState({ realContent: this.props.children })
        this.debouncedUpdateHtml(this.props.children)
      }
      if (prevProps.options.allowInline !== this.props.options.allowInline) {
        this.setState({ allowInline: this.props.options.allowInline })
      }
    }
  }

  handleLayoutModeChange (mode) {
    mode !== 'dnd' && this.setState({ contentEditable: mode === 'contentEditable', trackMouse: false })
    if (mode !== 'contentEditable') {
      this.iframeWindow.removeEventListener('click', this.handleGlobalClick)
      this.layoutHeader.removeEventListener('click', this.handleGlobalClick)
      this.iframeWindow.removeEventListener('click', this.handleEscapeClick)
      this.editor && this.editor.remove()
      this.removeOverlay()
      // Save data to map to undo/Redo
      const data = documentManager.get(this.props.id)
      const element = this.props.cook.get(data)
      const content = this.editor ? this.state.realContent : this.ref.innerHTML
      let contentToSave = this.getInlineMode() === 'text'
        ? striptags(content) : content
      const fieldKey = this.props.paramParentField ? this.props.paramParentField : this.props.fieldKey
      let fieldPathKey = fieldKey
      if (this.props.paramField && this.props.paramIndex >= 0) {
        contentToSave = this.getParamsGroupContent(element, contentToSave)
        fieldPathKey = `${fieldKey}:${this.props.paramIndex}:${this.props.paramField}`
      }

      if (this.props.fieldType === 'htmleditor') {
        const usedGoogleFonts = getUsedFonts(this.ref)
        if (usedGoogleFonts) {
          const sharedAssetsData = element.get('metaElementAssets')
          const sharedGoogleFonts = sharedAssetsData.googleFonts || {}
          sharedGoogleFonts[fieldPathKey] = usedGoogleFonts
          sharedAssetsData.googleFonts = sharedGoogleFonts
          element.set('metaElementAssets', sharedAssetsData)
        }
      }

      element.set(fieldKey, contentToSave)
      elementsStorage.trigger('update', element.get('id'), element.toJS(), `contentEditable:${element.get('tag')}:${fieldKey}`, { disableUpdateAssets: true })
      const workspaceStorageState = workspaceStorage.state('settings').get()

      if (workspaceStorageState && workspaceStorageState.action === 'edit') {
        const isSameElement = workspaceStorageState.id === this.props.id
        if (isSameElement) {
          const options = workspaceStorageState.options && workspaceStorageState.options.nestedAttr ? workspaceStorageState.options : ''
          const activeTab = workspaceStorageState.options && workspaceStorageState.options.nestedAttr ? workspaceStorageState.options.activeTab : ''
          window.setTimeout(() => {
            workspaceStorage.trigger('edit', this.props.id, activeTab, options)
          }, 1)
        }
      }
    }
    // add overlay
    if (this.state.contentEditable) {
      this.drawOverlay()
    }
  }

  getParamsGroupContent (element, content) {
    const attrValue = element.get(this.props.paramParentField)
    const newValue = lodash.defaultsDeep({}, attrValue)
    newValue.value[this.props.paramIndex][this.props.paramField] = content
    return newValue
  }

  drawOverlay () {
    let elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
    if (!elementOverlay) {
      elementOverlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'svg')
      elementOverlay.id = 'vcv-ui-content-overlay'
      elementOverlay.classList.add('vcv-ui-content-overlay-container')
      // todo: remove styles from js
      const styles = {
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0,
        transition: 'opacity .2s ease-in-out',
        pointerEvents: 'none',
        zIndex: 1900
      }
      for (const prop in styles) {
        elementOverlay.style[prop] = styles[prop]
      }
      this.iframeDocument.body.appendChild(elementOverlay)
    }

    let overlay = elementOverlay.querySelector('.vcv-ui-content-overlay')
    if (!overlay) {
      overlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'path')
      overlay.classList.add('vcv-ui-content-overlay')
      overlay.setAttribute('fill', 'rgba(0, 0, 0, .6)')
      overlay.setAttribute('fill-rule', 'evenodd')
      // todo: remove styles from js
      const styles = {
        pointerEvents: 'all'
      }
      for (const prop in styles) {
        overlay.style[prop] = styles[prop]
      }
      elementOverlay.appendChild(overlay)
    }

    let overlayShadow = this.iframeDocument.querySelector('#vcv-ui-content-overlay-shadow')
    if (!overlayShadow) {
      overlayShadow = this.iframeDocument.createElement('div')
      overlayShadow.id = 'vcv-ui-content-overlay-shadow'
      overlayShadow.classList.add('vcv-ui-content-overlay-shadow')
      // todo: remove styles from js
      const styles = {
        pointerEvents: 'none',
        boxShadow: 'rgba(0, 0, 0, 0.3) 1px 0 10px 0',
        position: 'fixed'
      }
      for (const prop in styles) {
        overlayShadow.style[prop] = styles[prop]
      }
      this.iframeDocument.body.appendChild(overlayShadow)
    }

    const data = {
      domElement: this.ref,
      overlayContainer: elementOverlay,
      overlay: overlay,
      overlayShadow: overlayShadow
    }
    this.autoUpdateOverlayPosition(data)
  }

  removeOverlay () {
    this.stopAutoUpdateOverlayPosition()
    const elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
    const clearAfterTransition = () => {
      const elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
      if (elementOverlay) {
        elementOverlay.removeEventListener('transitionend', clearAfterTransition.bind(this))
        elementOverlay.parentNode.removeChild(elementOverlay)
      }
      const elementOverlayShadow = this.iframeDocument.querySelector('#vcv-ui-content-overlay-shadow')
      if (elementOverlayShadow) {
        elementOverlayShadow.parentNode.removeChild(elementOverlayShadow)
      }
    }
    if (elementOverlay) {
      // elementOverlay.addEventListener('transitionend', clearAfterTransition.bind(this))
      clearAfterTransition()
      elementOverlay.style.opacity = 0
    }
  }

  updateOverlayPosition (data) {
    const paddingSize = {
      horizontal: 15,
      vertical: 5
    }
    const domElement = data.domElement
    const overlayContainer = data.overlayContainer
    const overlay = data.overlay
    const overlayShadow = data.overlayShadow

    // set main svg width and height
    overlayContainer.style.width = `${this.iframeWindow.innerWidth}px`
    overlayContainer.style.height = `${this.iframeWindow.innerHeight}px`

    // draw overlay for svg
    const containerSize = `M 0 0 H ${this.iframeWindow.innerWidth} V ${this.iframeWindow.innerHeight} H 0 V 0`
    const elementPos = domElement.getBoundingClientRect()
    const elPos = {
      x: Math.ceil(elementPos.left - paddingSize.horizontal),
      y: Math.ceil(elementPos.top - paddingSize.vertical),
      width: Math.floor(elementPos.width + paddingSize.horizontal * 2),
      height: Math.floor(elementPos.height + paddingSize.vertical * 2)
    }
    const elementSize = `M ${elPos.x} ${elPos.y} h ${elPos.width} v ${elPos.height} h -${elPos.width} z`
    overlay.setAttribute('d', `${containerSize} ${elementSize}`)

    const shadowSize = {
      left: elPos.x,
      top: elPos.y,
      width: elPos.width,
      height: elPos.height
    }
    for (const prop in shadowSize) {
      overlayShadow.style[prop] = shadowSize[prop] + 'px'
    }
  }

  /**
   * Automatically update controls container position after timeout
   * @param data
   */
  autoUpdateOverlayPosition (data) {
    this.stopAutoUpdateOverlayPosition()
    if (!this.state.overlayTimeout) {
      this.updateOverlayPosition(data)
      data.overlayContainer.style.opacity = 1
      this.setState({
        overlayTimeout: this.iframeWindow.setInterval(this.updateOverlayPosition.bind(this, data), 16)
      })
    }
  }

  /**
   * Stop automatically update controls container position and clear timeout
   */
  stopAutoUpdateOverlayPosition () {
    if (this.state.overlayTimeout) {
      this.iframeWindow.clearInterval(this.state.overlayTimeout)
      this.setState({
        overlayTimeout: null
      })
    }
  }

  editorSetup (options) {
    const editorSettings = {
      target: this.ref,
      menubar: false,
      inline: true,
      plugins: 'lists vcvhtmleditor',
      toolbar: [
        'formatselect | VcvFontsSelect | fontWeight | bold italic | numlist bullist | alignleft aligncenter alignright | dotButton'
      ],
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',
      init_instance_callback: (editor) => {
        editor.on('Change', (e) => {
          this.updateElementData(e.target.getContent())
        })
      },
      setup: (editor) => {
        editor.on('init', () => {
          this.editor = editor
          this.iframeDocument.body.setAttribute('vcv-tinymce-active', true)
          editor.fire('focusin')
          if (options.caretPosition) {
            this.setSelectionRange(this.ref, options.caretPosition)
          }
        })
        editor.on('remove', () => {
          this.iframeDocument.body.removeAttribute('vcv-tinymce-active')
        })
        editor.addButton('dotButton', {
          icon: 'vcv-ui-icon-edit',
          tooltip: 'Open Edit Form',
          onclick: this.handleMoreButtonClick
        })
      }
    }
    if (this.iframeDocument.body && (this.iframeDocument.body.clientWidth < 768)) {
      editorSettings.toolbar = [
        'formatselect | VcvFontsSelect | fontWeight',
        'bold italic | numlist bullist | alignleft aligncenter alignright | dotButton'
      ]
    }
    if (this.globalEditor && this.globalEditor.init) {
      initializeJqueryPlugin(this.iframeWindow)
      initializeTinymce(this.globalEditor, this.iframeWindow)
      this.globalEditor.init(editorSettings)
    } else {
      console.warn('TinyMCE editor is not enqueued')
    }
  }

  handleMoreButtonClick () {
    this.editor && this.editor.remove()
    if (vcCake.getData('vcv:layoutCustomMode') !== null) {
      vcCake.setData('vcv:layoutCustomMode', null)
      window.setTimeout(() => {
        this.handleLayoutModeChange(null)
      }, 0)
    }
    this.debouncedUpdateHtml(this.state.realContent)

    workspaceStorage.trigger('edit', this.props.id, '')
  }

  debouncedUpdateHtml (content) {
    if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || (content.indexOf('<!-- wp') !== -1 && content.indexOf('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block') === -1))) {
      // Instantly update HTML but also request server for additional rendering in background
      this.ref && (this.ref.innerHTML = content)
      this.debouncedUpdateHtmlWithServerRequest(content)
    } else {
      this.ref && (this.ref.innerHTML = content)
    }
  }

  debouncedUpdateHtmlWithServerRequest (content) {
    updateHtmlWithServerRequest(content, this.ref, this.props.id)
  }

  updateElementData (content) {
    this.setState({ realContent: content })
    wordpressDataStorage.state('status').set({ status: 'changed' })
  }

  handleGlobalClick (e) {
    const $target = window.jQuery(e.target)
    const inlineEditorClick = $target.is('.mce-container') || $target.parents('.mce-container').length || ($target.attr('class') && ($target.attr('class').indexOf('mce-') > -1))
    if (!inlineEditorClick && !$target.is('[data-vcv-element="' + this.props.id + '"]') && !$target.parents('[data-vcv-element="' + this.props.id + '"]').length) {
      this.closeInlineEditor()
    }
  }

  closeInlineEditor () {
    this.editor && this.editor.remove()
    if (vcCake.getData('vcv:layoutCustomMode') !== null) {
      vcCake.setData('vcv:layoutCustomMode', null)
      window.setTimeout(() => {
        this.handleLayoutModeChange(null)
      }, 0)
    }
    this.debouncedUpdateHtml(this.state.realContent)
  }

  handleEscapeClick (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeInlineEditor()
    }
  }

  handleDoubleClick () {
    if (this.state.trackMouse === false && this.state.contentEditable === false && this.state.allowInline) {
      this.setState({ trackMouse: true, contentEditable: true }, () => {
        const isHtmlEditor = this.props.fieldType === 'htmleditor'
        if (isHtmlEditor) {
          this.editorSetup({ caretPosition: this.state.caretPosition })
        }
        const layoutCustomMode = vcCake.getData('vcv:layoutCustomMode') && vcCake.getData('vcv:layoutCustomMode').mode
        if (layoutCustomMode !== 'contentEditable') {
          const data = {
            mode: 'contentEditable',
            options: {}
          }
          vcCake.setData('vcv:layoutCustomMode', data)
          this.handleLayoutModeChange('contentEditable')
        }
        this.iframeWindow.addEventListener('click', this.handleGlobalClick)
        this.layoutHeader.addEventListener('click', this.handleGlobalClick)
        this.iframeWindow.addEventListener('keydown', this.handleEscapeClick)
        this.ref && (this.ref.innerHTML = this.state.realContent)

        if (!isHtmlEditor) {
          this.setSelectionRange(this.ref, this.state.caretPosition)
        }
      })
    }
  }

  handleMouseMove () {
    if (this.state.trackMouse === true) {
      this.setState({ trackMouse: false, contentEditable: false })
      this.editor && this.editor.remove()
    }
  }

  handleMouseDown (e) {
    if (e.detail === 2 && this.state.trackMouse === false && this.state.contentEditable === false && this.state.allowInline) {
      const currentTarget = e.currentTarget
      this.setState({ temporaryEditable: true }, () => {
        window.setTimeout(() => {
          const caretPosition = this.getCaretPosition(currentTarget)
          this.setState({
            caretPosition: caretPosition,
            temporaryEditable: false
          })
        }, 0)
      })
    }
  }

  getInlineMode () {
    return this.props.options && this.props.options.inlineMode
  }

  getCaretPosition (element) {
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    let caretOffset = 0
    if (typeof win.getSelection !== 'undefined') {
      const sel = win.getSelection()
      if (sel.rangeCount) {
        const range = sel.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        const preCaretRangeString = preCaretRange.toString()
        const matchNewlines = preCaretRangeString.match(/(\r\n\t|\n|\r\t)/gm)
        caretOffset = preCaretRangeString.length
        if (matchNewlines && matchNewlines.length) {
          caretOffset -= matchNewlines.length
        }
      }
    }
    return caretOffset
  }

  setSelectionRange (element, start, end = start) {
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    if (doc.createRange && win.getSelection) {
      const range = doc.createRange()
      range.selectNodeContents(element)
      const textNodes = this.getTextNodesIn(element)
      let foundStart = false
      let charCount = 0
      let endCharCount = null

      for (let i = 0; i < textNodes.length; i++) {
        const textNode = textNodes[i]
        endCharCount = charCount + textNode.length
        if (!foundStart && start >= charCount && (start < endCharCount || (start === endCharCount && i <= textNodes.length))) {
          range.setStart(textNode, start - charCount)
          foundStart = true
        }
        if (foundStart && end <= endCharCount) {
          range.setEnd(textNode, end - charCount)
          break
        }
        charCount = endCharCount
      }

      const sel = win.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  getTextNodesIn (node) {
    const textNodes = []
    if (node.nodeType === 3) {
      textNodes.push(node)
    } else {
      const children = node.childNodes
      for (let i = 0, len = children.length; i < len; ++i) {
        textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]))
      }
    }
    return textNodes
  }

  render () {
    const CustomTag = this.props.fieldType === 'htmleditor' ? 'div' : 'span'
    const props = {
      className: this.props.className ? this.props.className + ' vcvhelper' : 'vcvhelper',
      contentEditable: this.state.contentEditable || this.state.temporaryEditable,
      onDoubleClick: this.handleDoubleClick,
      onMouseMove: this.handleMouseMove,
      onMouseDown: this.handleMouseDown,
      'data-vcvs-html': this.state.realContent,
      'data-vcv-content-editable-inline-mode': this.getInlineMode() || 'html'
    }
    props.ref = (ref) => { this.ref = ref }

    return <CustomTag {...props} />
  }
}
