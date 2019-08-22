import React from 'react'
import TinyMceButtonsBuilder from 'public/components/layoutHelpers/contentEditable/lib/tinymceButtonsBuilder'
import './css/content.css'
import './css/wpEditor.css'
import ToggleSmall from '../toggleSmall/Component'
import webFontLoader from 'webfontloader'
import { getService } from 'vc-cake'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

export default class HtmlEditorComponent extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeQtagsEditor = this.handleChangeQtagsEditor.bind(this)
    this.handleSkinChange = this.handleSkinChange.bind(this)
    this.addFontDropdowns = this.addFontDropdowns.bind(this)
    this.handleFontChange = this.handleFontChange.bind(this)
    this.handleFontWeightChange = this.handleFontWeightChange.bind(this)
    this.handleCustomDropdownChange = this.handleCustomDropdownChange.bind(this)
    this.initWpEditorJs = this.initWpEditorJs.bind(this)
    this.id = `tinymce-htmleditor-component-${props.fieldKey}`
    this.state = {}
    this.state.darkTextSkin = this.getDarkTextSkinState()
    this.state.value = props.value
  }

  static getDerivedStateFromProps (props, currentState) {
    if (currentState.value !== props.value) {
      return {
        value: props.value
      }
    }
    return null
  }

  shouldComponentUpdate (newProps, newState) {
    if (this.props.dynamicFieldOpened !== newProps.dynamicFieldOpened) {
      if (typeof window.tinymce !== 'undefined') {
        if (this.props.editorLoaded) {
          this.destroyEditor()
        }
        window.setTimeout(this.initWpEditorJs, 1)
      }

      return true
    }
    if (newProps.editorLoaded && typeof window.tinymce !== 'undefined') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      const editor = window.tinymce.get(id)
      if (editor) {
        editor.getBody().style.backgroundColor = newState.darkTextSkin ? '#2f2f2f' : ''
        if (newState.value.match(blockRegexp)) {
          let blockInfo = parseDynamicBlock(newState.value)
          let blockValue = newState.value.match(blockRegexp)

          if (blockInfo) {
            let before = blockInfo.beforeBlock || ''
            let after = blockInfo.afterBlock || ''
            // We have to encode the html comment
            let valueForEditor = before + window.encodeURIComponent(blockValue[ 0 ]) + window.encodeURIComponent(blockValue[ 1 ]) + after
            editor.setContent(valueForEditor)
          }
        }
        if (this.props.value !== newProps.value && !this.editorValue) {
          if (newProps.value.match(blockRegexp)) {
            let blockInfo = parseDynamicBlock(newProps.value)
            let blockValue = newProps.value.match(blockRegexp)

            if (blockInfo) {
              let before = blockInfo.beforeBlock || ''
              let after = blockInfo.afterBlock || ''

              // We have to encode the html comment
              let valueForEditor = before + window.encodeURIComponent(blockValue[ 0 ]) + window.encodeURIComponent(blockValue[ 1 ]) + after
              editor.setContent(valueForEditor)
            }
          } else {
            editor.setContent(newProps.value)
          }
          this.loadUsedFonts(newProps)
          editor.nodeChanged()
        }
        if (this.editorValue) {
          this.editorValue = null
        }
      }

      return this.props.editorLoaded !== newProps.editorLoaded
    }

    return newProps.editorLoaded ? this.props.value !== newProps.value : true
  }

  loadUsedFonts (props) {
    if (!this.editor) {
      return
    }
    const element = props.elementAccessPoint.cook()
    const sharedAssetsData = element.get('metaElementAssets')
    let iframeSettings = {}
    if (this.editor.getWin()) {
      iframeSettings.context = this.editor.getWin()
    }
    const fieldPathKey = props.options.nestedAttrPath ? props.options.nestedAttrPath : props.fieldKey
    if (sharedAssetsData && sharedAssetsData.googleFonts && sharedAssetsData.googleFonts[ fieldPathKey ]) {
      const families = Object.keys(sharedAssetsData.googleFonts[ fieldPathKey ])
      if (families && families.length > 0) {
        webFontLoader.load({
          google: {
            families: families
          },
          ...iframeSettings
        })
      }
    }
  }

  addFontDropdowns (editor) {
    let toolbars = [ 'toolbar1', 'toolbar2', 'toolbar3', 'toolbar4' ]
    let overwriteGoogleFonts = false
    let overwriteFontSize = false
    let buttonsToAdd = 'googleFonts,fontWeight'
    let sizeButtons = 'fontSizeSelectAdvanced,lineHeight,letterSpacing'

    // overwrite default fontselect dropdown
    toolbars.forEach((toolbar) => {
      if (editor.settings.hasOwnProperty(toolbar)) {
        if (editor.settings[ toolbar ].indexOf('fontselect') > -1) {
          editor.settings[ toolbar ] = editor.settings[ toolbar ].replace('fontselect', buttonsToAdd)
          overwriteGoogleFonts = true
        }
        if (editor.settings[ toolbar ].indexOf('fontsizeselect') > -1) {
          editor.settings[ toolbar ] = editor.settings[ toolbar ].replace('fontsizeselect', sizeButtons)
          overwriteFontSize = true
        }
      }
    })
    // Toolbar as array
    if (editor.settings.hasOwnProperty('toolbar')) {
      if (editor.settings.toolbar[ 0 ].indexOf('fontselect') > -1) {
        editor.settings.toolbar[ 0 ] = editor.settings.toolbar[ 0 ].replace('fontselect', buttonsToAdd)
        overwriteGoogleFonts = true
      }
      if (editor.settings.toolbar[ 0 ].indexOf('fontsizeselect') > -1) {
        editor.settings.toolbar[ 0 ] = editor.settings.toolbar[ 0 ].replace('fontsizeselect', sizeButtons)
        overwriteFontSize = true
      }
    }

    if (!overwriteGoogleFonts) {
      if (editor.settings.toolbar2) {
        editor.settings.toolbar2 = buttonsToAdd + ',' + editor.settings.toolbar2
      } else {
        editor.settings.toolbar2 = buttonsToAdd
      }
    }

    if (!overwriteFontSize) {
      let toolbar2 = editor.settings.toolbar2.split(buttonsToAdd)
      editor.settings.toolbar2 = buttonsToAdd + `,${sizeButtons}` + toolbar2[ 1 ]
    }

    this.buttonBuilder = new TinyMceButtonsBuilder(editor, window.tinymce, true)

    this.buttonBuilder.addGoogleFontsDropdown('googleFonts', {
      type: 'listbox',
      text: 'Font Family',
      tooltip: 'Font Family',
      icon: false,
      fixedWidth: true,
      onselect: this.handleFontChange
    })

    this.buttonBuilder.addFontWeightDropdown('fontWeight', {
      type: 'listbox',
      text: 'Font Weight',
      tooltip: 'Font Weight',
      icon: false,
      fixedWidth: true,
      onselect: this.handleFontWeightChange
    })

    this.buttonBuilder.addFontSizeDropdown('fontSizeSelectAdvanced', {
      type: 'listbox',
      text: 'Font Sizes',
      tooltip: 'Font Sizes',
      fixedWidth: true,
      onselect: this.handleCustomDropdownChange
    })

    this.buttonBuilder.addLineHeightDropdown('lineHeight', {
      type: 'listbox',
      text: 'Line Height',
      tooltip: 'Line Height',
      fixedWidth: true,
      onselect: this.handleCustomDropdownChange
    })

    this.buttonBuilder.addLetterSpacingDropdown('letterSpacing', {
      type: 'listbox',
      text: 'Letter Spacing',
      tooltip: 'Letter Spacing',
      fixedWidth: true,
      onselect: this.handleCustomDropdownChange
    })

    editor.on('init', () => {
      editor.formatter.register('fontweight', {
        inline: 'span',
        toggle: false,
        styles: { fontWeight: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('fontstyle', {
        inline: 'span',
        toggle: false,
        styles: { fontStyle: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('lineheight', {
        selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
        toggle: false,
        styles: { lineHeight: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('letterspacing', {
        selector: 'span,figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
        toggle: false,
        styles: { letterSpacing: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('defaultfont', {
        inline: 'span',
        toggle: false,
        styles: { fontFamily: '' },
        clear_child_styles: true
      })
    })
  }

  handleCustomDropdownChange () {
    this.handleChangeWpEditor(this.editor)
  }

  handleFontWeightChange () {
    this.handleFontChange()
    this.handleChangeWpEditor(this.editor)
  }

  handleFontChange () {
    const { fieldKey, elementAccessPoint, options } = this.props
    const usedGoogleFonts = this.buttonBuilder.getUsedFonts(this.editor.getBody())

    if (usedGoogleFonts) {
      const element = elementAccessPoint.cook()
      const sharedAssetsData = element.get('metaElementAssets')
      const fieldPathKey = options.nestedAttrPath ? options.nestedAttrPath : fieldKey
      let sharedGoogleFonts = sharedAssetsData.googleFonts || {}
      sharedGoogleFonts[ fieldPathKey ] = usedGoogleFonts
      sharedAssetsData.googleFonts = sharedGoogleFonts
      elementAccessPoint.set('metaElementAssets', sharedAssetsData)
    }
    this.handleChangeWpEditor(this.editor)
  }

  handleChange (event) {
    this.props.setFieldValue(event.currentTarget.value)
  }

  handleChangeWpEditor (editor) {
    let value = editor.getContent()
    if (this.props.dynamicFieldOpened) {
      // the value html comment is encoded in this momment
      value = decodeURIComponent(value)
      let blockInfo = parseDynamicBlock(value)
      if (blockInfo) {
        this.setState({
          blockInfo: blockInfo
        })
      }
    }

    let { updater, fieldKey, fieldType, setValueState } = this.props
    this.editorValue = true
    setValueState(value)
    window.setTimeout(() => {
      updater(fieldKey, value, null, fieldType)
    }, 0)
  }

  handleChangeQtagsEditor (e) {
    const field = e.target
    this.props.setFieldValue(field.value)
  }

  handleSkinChange (fieldKey, isDark) {
    this.setState({ darkTextSkin: isDark })
    this.props.updater(fieldKey, isDark)
  }

  renderFallbackEditor () {
    let { value } = this.props

    return (
      <div className='vcv-ui-form-input vcv-ui-form-tinymce'>
        <textarea
          id={this.id}
          onChange={this.handleChange}
          onKeyUp={this.handleChange}
          value={value}
          style={{
            width: '100%',
            minHeight: '300px'
          }} />
      </div>
    )
  }

  initWpEditorJs (firstLoad) {
    const { fieldKey } = this.props
    let id = `vcv-wpeditor-${fieldKey}`
    if (!document.querySelector('#' + id)) {
      return
    }
    if (window.tinyMCEPreInit) {
      if (this.props.dynamicFieldOpened) {
        window.tinyMCEPreInit.mceInit[ id ] = Object.assign({}, window.tinyMCEPreInit.mceInit[ '__VCVIDDYNAMIC__' ], {
          id: id,
          menubar: false,
          statusbar: false,
          // inline: true,
          plugins: 'textcolor',
          toolbar1: 'formatselect,bold,italic,alignleft,aligncenter,alignright',
          toolbar2: 'fontselect,fontsizeselect,removeformat,forecolor',
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
          formats: {
            fontweight: {
              inline: 'span',
              toggle: false,
              styles: { fontWeight: '%value' },
              clear_child_styles: true
            },
            fontstyle: {
              inline: 'span',
              toggle: false,
              styles: { fontStyle: '%value' },
              clear_child_styles: true
            },
            defaultfont: {
              inline: 'span',
              toggle: false,
              styles: { fontFamily: '' },
              clear_child_styles: true
            }
          },
          selector: '#' + id,
          setup: (editor) => {
            this.editor = editor
            editor.on('keyup change undo redo', this.handleChangeWpEditor.bind(this, editor))
            this.addFontDropdowns(editor)
          },
          init_instance_callback: (editor) => {
            if (!firstLoad) {
              let editorWrapper = document.querySelector('.vcv-ui-form-wp-tinymce')
              const isInViewport = (elem) => {
                const bounding = elem.getBoundingClientRect()
                return (
                  bounding.top >= 0 &&
                  bounding.left >= 0 &&
                  bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                  bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
                )
              }
              if (editorWrapper && !isInViewport(editorWrapper)) {
                editorWrapper.scrollIntoView()
              }
            }
            this.loadUsedFonts(this.props)
            editor.iframeElement.style.display = 'none'
            editor.on('BeforeExecCommand', function () {
              editor.selection.select(editor.getBody(), true)
            })
            editor.on('nodeChange', () => {
              editor.selection.select(editor.getBody(), true)
            })
            editor.selection.select(editor.getBody(), true)
            this.props.setEditorLoaded(true)
          }
        })
        window.tinyMCEPreInit.qtInit[ id ] = Object.assign({}, window.tinyMCEPreInit.qtInit[ '__VCVIDDYNAMIC__' ], {
          id: id
        })
        window.setTimeout(() => {
          if (document.querySelector('#' + id)) {
            window.switchEditors && window.switchEditors.go(id, 'tmce')
          }
        }, 10)
      } else {
        window.tinyMCEPreInit.mceInit[ id ] = Object.assign({}, window.tinyMCEPreInit.mceInit[ '__VCVID__' ], {
          id: id,
          selector: '#' + id,
          setup: (editor) => {
            this.editor = editor
            editor.on('keyup change undo redo', this.handleChangeWpEditor.bind(this, editor))
            this.addFontDropdowns(editor)
          },
          init_instance_callback: () => {
            this.loadUsedFonts(this.props)
            this.props.setEditorLoaded(true)
          }
        })
        window.tinyMCEPreInit.qtInit[ id ] = Object.assign({}, window.tinyMCEPreInit.qtInit[ '__VCVID__' ], {
          id: id
        })

        window.setTimeout(() => {
          if (document.querySelector('#' + id)) {
            window.quicktags && window.quicktags(window.tinyMCEPreInit.qtInit[ id ])
            window.switchEditors && window.switchEditors.go(id, 'tmce')
            if (window.QTags) {
              delete window.QTags.instances[ 0 ]
              if (window.QTags.instances[ id ]) {
                window.QTags.instances[ id ].canvas.addEventListener('keyup', this.handleChangeQtagsEditor)
              }
            }
          }
        }, 10)
      }
    }
  }

  componentDidMount () {
    if (typeof window.tinymce !== 'undefined') {
      window.setTimeout(() => {
        this.initWpEditorJs(true)
      }, 1)
    }
  }

  componentWillUnmount () {
    if (typeof window.tinymce !== 'undefined') {
      this.destroyEditor()
    }
  }

  destroyEditor () {
    if (typeof window.tinymce !== 'undefined') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      window.tinyMCE && window.tinyMCE.get(id) && window.tinyMCE.get(id).remove()
      window.tinyMCE && window.tinyMCE.editors && window.tinyMCE.editors[ id ] && window.tinyMCE.editors[ id ].destroy()
      if (window.QTags && window.QTags.instances[ id ]) {
        window.QTags.instances[ id ].canvas.removeEventListener('keyup', this.handleChangeQtagsEditor)
        delete window.QTags.instances[ id ]
      }
      this.editor = false
      this.props.setEditorLoaded(false)
    }
  }

  getSkinToggle () {
    const toggleFieldKey = this.props && this.props.options && this.props.options.skinToggle
    if (!toggleFieldKey) {
      return null
    }
    return (
      <ToggleSmall
        api={this.props.api}
        fieldKey={toggleFieldKey}
        updater={this.handleSkinChange}
        value={this.state.darkTextSkin}
      />
    )
  }

  getDarkTextSkinState () {
    let { elementAccessPoint, options, editFormOptions } = this.props
    const toggleFieldKey = options && options.skinToggle

    if (editFormOptions && editFormOptions.nestedAttr && editFormOptions.activeParamGroup) {
      return !!(toggleFieldKey && editFormOptions.activeParamGroup[ toggleFieldKey ])
    }
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()
    return !!(toggleFieldKey && element && element[ toggleFieldKey ])
  }

  getFieldComponent (template) {
    return <React.Fragment>
      <div className='vcv-ui-form-wp-tinymce-inner' dangerouslySetInnerHTML={{ __html: template }} />
      {this.getSkinToggle()}
    </React.Fragment>
  }

  render () {
    if (typeof window.tinymce !== 'undefined') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`

      const { dynamicFieldOpened } = this.props
      if (dynamicFieldOpened) {
        let valueForEditor = this.state.value
        if (this.state.value.match(blockRegexp)) {
          let blockInfo = parseDynamicBlock(this.state.value)
          let blockValue = this.state.value.match(blockRegexp)

          if (blockInfo) {
            let before = blockInfo.beforeBlock || ''
            let after = blockInfo.afterBlock || ''

            // We have to encode the html comment
            valueForEditor = before + window.encodeURIComponent(blockValue[ 0 ]) + window.encodeURIComponent(blockValue[ 1 ]) + after
          }
        }

        let template = document.getElementById('vcv-wpeditor-dynamic-template').innerHTML
          .replace(/__VCVIDDYNAMIC__/g, id)
          .replace(/%%content%%/g, valueForEditor)

        return (
          <React.Fragment>
            {this.getFieldComponent(template)}
          </React.Fragment>
        )
      } else {
        let template = document.getElementById('vcv-wpeditor-template').innerHTML
          .replace(/__VCVID__/g, id)
          .replace(/%%content%%/g, this.state.value)

        return (
          <React.Fragment>
            {this.getFieldComponent(template)}
          </React.Fragment>
        )
      }
    }
    return this.renderFallbackEditor()
  }
}
