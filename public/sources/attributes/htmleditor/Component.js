import React from 'react'
import classNames from 'classnames'
import TinyMceButtonsBuilder from 'public/components/layoutHelpers/contentEditable/lib/tinymceButtonsBuilder'
import './css/content.css'
import './css/wpEditor.css'
import Attribute from '../attribute'
import ToggleSmall from '../toggleSmall/Component'
import webFontLoader from 'webfontloader'
import { env, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'

const { getBlockRegexp } = getService('utils')
const { getDynamicFieldsList, getDynamicValue } = getService('cook').dynamicFields
const blockRegexp = getBlockRegexp()

export default class HtmlEditorComponent extends Attribute {
  static defaultProps = {
    fieldType: 'htmleditor'
  }

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
    this.state.darkTextSkin = this.getDarkTextSkinState()
  }

  shouldComponentUpdate (newProps, newState) {
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && newProps.options && newProps.options.dynamicField
    if (isDynamic) {
      if (
        (typeof newState.value === 'string' && newState.value.match(blockRegexp)) ||
        (typeof this.state.value === 'string' && this.state.value.match(blockRegexp))
      ) {
        return true
      }
    }
    if (this.state.editorLoaded && typeof window.tinymce !== 'undefined') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      const editor = window.tinymce.get(id)
      if (editor) {
        editor.getBody().style.backgroundColor = newState.darkTextSkin ? '#2f2f2f' : ''
        if (this.props.value !== newProps.value) {
          editor.setContent(newProps.value)
          this.loadUsedFonts(newProps)
        }
      }

      return false
    }

    return this.state.editorLoaded ? this.state.value !== newState.value : true
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
    this.setFieldValue(event.currentTarget.value)
  }

  handleChangeWpEditor (editor) {
    this.setFieldValue(editor.getContent())
  }

  handleChangeQtagsEditor (e) {
    const field = e.target
    this.setFieldValue(field.value)
  }

  handleSkinChange (fieldKey, isDark) {
    this.setState({ darkTextSkin: isDark })
    this.props.updater(fieldKey, isDark)
  }

  renderFallbackEditor () {
    let { value } = this.state

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

  initWpEditorJs () {
    const { fieldKey } = this.props
    const id = `vcv-wpeditor-${fieldKey}`
    if (!document.querySelector('#' + id)) {
      return
    }
    if (window.tinyMCEPreInit) {
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
          this.setState({ editorLoaded: true })
        }
      })
      window.tinyMCEPreInit.qtInit[ id ] = Object.assign({}, window.tinyMCEPreInit.qtInit[ '__VCVID__' ], {
        id: id
      })
    }

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
    }, 1)
  }

  componentDidMount () {
    if (typeof window.tinymce !== 'undefined') {
      this.initWpEditorJs()
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
      window.tinyMCE && window.tinyMCE.editors && window.tinyMCE.editors[ id ] && window.tinyMCE.editors[ id ].destroy()
      if (window.QTags && window.QTags.instances[ id ]) {
        window.QTags.instances[ id ].canvas.removeEventListener('keyup', this.handleChangeQtagsEditor)
        delete window.QTags.instances[ id ]
      }
      this.editor = false
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

  handleDynamicFieldClose (e) {
    super.handleDynamicFieldClose(e)
    if (typeof window.tinymce !== 'undefined') {
      window.setTimeout(this.initWpEditorJs, 1)
    }
  }

  handleDynamicFieldOpen (e) {
    if (typeof window.tinymce !== 'undefined') {
      this.destroyEditor()
    }
    super.handleDynamicFieldOpen(e)
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

  render () {
    if (typeof window.tinymce !== 'undefined') {
      const { value } = this.state
      const { fieldKey, options } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && options && options.dynamicField
      const template = document.getElementById('vcv-wpeditor-template').innerHTML
        .replace(/__VCVID__/g, id)
        .replace(/%%content%%/g, value)
      const cssClasses = classNames({
        'vcv-ui-form-wp-tinymce': true,
        'vcv-is-invisible': this.state.editorLoaded !== true,
        'vcv-ui-form-field-dynamic': isDynamic
      })

      let dynamicComponent = null
      let extraDynamicComponent = null

      let dynamicComponentOpen = null
      if (isDynamic && typeof value === 'string' && !value.match(blockRegexp)) {
        dynamicComponentOpen =
          <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control ' onClick={this.handleDynamicFieldOpen} title='Open Dynamic Field' />
      }

      let fieldComponent = <React.Fragment>
        <div className={cssClasses}>
          <div dangerouslySetInnerHTML={{ __html: template }} />
          {this.getSkinToggle()}
          {dynamicComponentOpen}
        </div>
      </React.Fragment>

      if (isDynamic && typeof value === 'string' && value.match(blockRegexp)) {
        let blockInfo = value.split(blockRegexp)
        let blockAtts = JSON.parse(blockInfo[ 4 ].trim())

        let fieldList = getDynamicFieldsList(this.props.fieldType)
        fieldComponent = (
          <Dropdown
            value={blockAtts.value.replace(/^(.+)(::)(.+)$/, '$1$2')}
            fieldKey={`${this.props.fieldKey}-dynamic-dropdown`}
            options={{
              values: fieldList
            }}
            updater={this.handleDynamicFieldChange}
            extraClass='vcv-ui-form-field-dynamic'
          />
        )

        dynamicComponent = (
          <span className='vcv-ui-icon vcv-ui-icon-close vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldClose} title='Close Dynamic Field' />
        )
        if (blockAtts.value.match(/::/)) {
          const [ dynamicFieldKey, extraKey ] = blockAtts.value.split('::')
          const updateExtraKey = (e) => {
            e && e.preventDefault()
            const extraDynamicFieldKey = e.currentTarget && e.currentTarget.value
            const dynamicFieldKeyFull = `${dynamicFieldKey}::${extraDynamicFieldKey}`
            let newValue = getDynamicValue(dynamicFieldKeyFull)
            this.setFieldValue(newValue)
            this.setState({
              prevAttrDynamicKey: dynamicFieldKeyFull
            })
          }
          const extraDynamicFieldClassNames = classNames({
            'vcv-ui-form-input': true,
            'vcv-ui-form-field-dynamic': true,
            'vcv-ui-form-field-dynamic-extra': true
          })
          extraDynamicComponent =
            <input type='text' className={extraDynamicFieldClassNames} onChange={updateExtraKey} value={extraKey} placeholder='Enter valid meta key' />
        }
      }

      return (
        <React.Fragment>
          {fieldComponent}
          {dynamicComponent}
          {extraDynamicComponent}
        </React.Fragment>
      )
    }
    return this.renderFallbackEditor()
  }
}
