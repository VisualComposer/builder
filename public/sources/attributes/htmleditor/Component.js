import React from 'react'
import classnames from 'classnames'
import TinyMceEditor from 'react-tinymce'
// import './css/skin.css'
import './css/content.css'
import './css/wpEditor.css'
import Attribute from '../attribute'
import lodash from 'lodash'
import vcCake from 'vc-cake'
import ToggleSmall from '../toggleSmall/Component'
export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.handleChangeQtagsEditor = this.handleChangeQtagsEditor.bind(this)
    this.handleSkinChange = this.handleSkinChange.bind(this)
    this.id = `tinymce-htmleditor-component-${props.fieldKey}`
    this.state.darkTextSkin = this.getDarkTextSkinState()
  }

  shouldComponentUpdate (nextProps) {
    if (this.state.editorLoaded && this.props.value !== nextProps.value && vcCake.env('platform') === 'wordpress') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      window.tinymce.get(id).setContent(nextProps.value)
      return false
    }
    return true
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value && vcCake.env('platform') !== 'wordpress') {
      window.tinymce.EditorManager.get(this.id).setContent(nextProps.value)
    }
    // super.componentWillReceiveProps(nextProps)
  }

  handleChange (event, editor) {
    const value = editor.getContent()
    this.setFieldValue(value)
  }

  handleChangeWpEditor (editor) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, editor.getContent())
  }

  handleChangeQtagsEditor (e) {
    const { updater, fieldKey } = this.props
    const field = e.target
    updater(fieldKey, field.value)
  }

  handleSkinChange (fieldKey, isDark) {
    this.setState({ darkTextSkin: isDark })
    this.props.updater(fieldKey, isDark)
  }

  renderEditor () {
    let { value } = this.state
    let { options } = this.props
    let tinymceConfig = lodash.extend({}, {
      toolbar: [
        'styleselect | bold italic | link image | alignleft aligncenter alignright'
      ],
      skin: false,
      menubar: false
    }, options.tinymce)
    return (
      <div className='vcv-ui-form-input vcv-ui-form-tinymce'>
        <TinyMceEditor
          id={this.id}
          config={tinymceConfig}
          onChange={this.handleChange}
          onKeyup={this.handleChange}
          content={value} />
      </div>
    )
  }

  initWpEditorJs () {
    const { fieldKey } = this.props
    const id = `vcv-wpeditor-${fieldKey}`
    if (window.tinyMCEPreInit) {
      window.tinyMCEPreInit.mceInit[ id ] = Object.assign({}, window.tinyMCEPreInit.mceInit[ '__VCVID__' ], {
        id: id,
        selector: '#' + id,
        setup: (editor) => {
          editor.on('keyup change undo redo', this.handleChangeWpEditor.bind(this, editor))
        },
        init_instance_callback: () => {
          this.setState({ editorLoaded: true })
        }
      })
      window.tinyMCEPreInit.qtInit[ id ] = Object.assign({}, window.tinyMCEPreInit.qtInit[ '__VCVID__' ], {
        id: id
      })
    }

    window.setTimeout(() => {
      window.quicktags && window.quicktags(window.tinyMCEPreInit.qtInit[ id ])
      window.switchEditors && window.switchEditors.go(id, 'tmce')
      if (window.QTags) {
        delete window.QTags.instances[ 0 ]
        if (window.QTags.instances[ id ]) {
          window.QTags.instances[ id ].canvas.addEventListener('keyup', this.handleChangeQtagsEditor)
        }
      }
    }, 0)
  }

  componentDidMount () {
    if (vcCake.env('platform') === 'wordpress') {
      this.initWpEditorJs()
    }
  }

  componentWillUnmount () {
    if (vcCake.env('platform') === 'wordpress') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      window.tinyMCE && window.tinyMCE.editors && window.tinyMCE.editors[ id ] && window.tinyMCE.editors[ id ].destroy()
      if (window.QTags && window.QTags.instances[ id ]) {
        window.QTags.instances[ id ].canvas.removeEventListener('keyup', this.handleChangeQtagsEditor)
        delete window.QTags.instances[ id ]
      }
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
    let { elementAccessPoint, options } = this.props
    const toggleFieldKey = options && options.skinToggle
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()
    return !!(toggleFieldKey && element && element[ toggleFieldKey ])
  }

  render () {
    if (vcCake.env('platform') === 'wordpress') {
      const { value } = this.state
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      if (this.state.editorLoaded) {
        const editor = window.tinymce.get(id)
        if (editor && editor.getBody()) {
          editor.getBody().style.backgroundColor = this.state.darkTextSkin ? '#2F2F2F' : ''
        }
      }
      const template = document.getElementById('vcv-wpeditor-template').innerHTML
        .replace(/__VCVID__/g, id)
        .replace(/%%content%%/g, value)
      const cssClasses = classnames({
        'vcv-ui-form-wp-tinymce': true,
        'vcv-is-invisible': this.state.editorLoaded !== true
      })
      return <div className={cssClasses}>
        <div dangerouslySetInnerHTML={{ __html: template }} />
        {this.getSkinToggle()}
      </div>
    }
    return this.renderEditor()
  }
}
