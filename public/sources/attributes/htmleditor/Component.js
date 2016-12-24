import React from 'react'
import classnames from 'classnames'
import TinyMceEditor from 'react-tinymce'
import './css/skin.css'
import './css/content.css'
import './css/wpEditor.css'
import Attribute from '../attribute'
import lodash from 'lodash'
import vcCake from 'vc-cake'
const dataProcessor = vcCake.getService('dataProcessor')

export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.handleChangeQtagsEditor = this.handleChangeQtagsEditor.bind(this)
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
          config={tinymceConfig}
          onChange={this.handleChange}
          onKeyup={this.handleChange}
          content={value} />
      </div>
    )
  }

  componentDidMount () {
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION') && vcCake.env('platform') === 'wordpress') {
      if (document.getElementById('vcv-wpeditor-template')) {
        this.setState({editor: document.getElementById('vcv-wpeditor-template').innerHTML})
      } else {
        dataProcessor.appAdminServerRequest({
          'vcv-action': 'editor:wpEditor:adminNonce'
        }).then((data) => {
          let range = document.createRange()
          let documentFragment = range.createContextualFragment(data)
          document.body.appendChild(documentFragment)

          this.setState({ editor: document.getElementById('vcv-wpeditor-template').innerHTML })

        })
      }
    }
  }
  initWpEditorJs () {
    const { fieldKey } = this.props
    const id = `vcv-wpeditor-${fieldKey}`
    if (window.tinyMCEPreInit) {
      window.tinyMCEPreInit.mceInit[ id ] = Object.assign({}, window.tinyMCEPreInit.mceInit[ '__VCVID__' ], {
        id: id,
        selector: '#' + id,
        setup: (editor) => {
          editor.on('keyup change undo redo SetContent', this.handleChangeWpEditor.bind(this, editor))
        }
      })
      window.tinyMCEPreInit.qtInit[ id ] = Object.assign({}, window.tinyMCEPreInit.qtInit[ '__VCVID__' ], {
        id: id
      })
    }

    // window.setTimeout(() => {
    window.quicktags && window.quicktags(window.tinyMCEPreInit.qtInit[ id ])
    window.switchEditors && window.switchEditors.go(id, 'tmce')
    if (window.QTags) {
      delete window.QTags.instances[ 0 ]
      if (window.QTags.instances[ id ]) {
        window.QTags.instances[ id ].canvas.addEventListener('keyup', this.handleChangeQtagsEditor)
      }
    }
    this.setState({ editorLoaded: true })
    // }, 0)
  }
  componentWillUnmount () {
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION') && vcCake.env('platform') === 'wordpress') {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      window.tinyMCE && window.tinyMCE.editors[ id ].destroy()
      if (window.QTags && window.QTags.instances[ id ]) {
        window.QTags.instances[ id ].canvas.removeEventListener('keyup', this.handleChangeQtagsEditor)
        delete window.QTags.instances[ id ]
      }
    }
  }

  render () {
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION') && vcCake.env('platform') === 'wordpress') {
      let template = '<span class="vcv-ui-wp-spinner-lg">Loading...</span>'
      const { value } = this.state
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      // document.getElementById('vcv-wpeditor-template').innerHTML
      if (this.state.editor) {
        template = this.state.editor
          .replace(/__VCVID__/g, id)
          .replace(/%%content%%/g, value)
        window.setTimeout(() => {
          this.initWpEditorJs()
        }, 0)
      }
      const cssClasses = classnames({
        'vcv-ui-form-wp-tinymce': true,
        'vcv-is-invisible': this.state.editorLoaded !== true
      })
      return <div className={cssClasses} dangerouslySetInnerHTML={{__html: template}} />
    }
    return this.renderEditor()
  }
}
