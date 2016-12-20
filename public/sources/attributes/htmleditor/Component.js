import React from 'react'
import TinyMceEditor from 'react-tinymce'
import './css/skin.css'
import './css/content.css'
import Attribute from '../attribute'
import lodash from 'lodash'
import vcCake from 'vc-cake'

export default class Component extends Attribute {
  handleChange (event, editor) {
    let value = editor.getContent()
    this.setFieldValue(value)
  }

  handleChangeWpEditor (editor) {
    console.log('try')
    let { updater, fieldKey } = this.props
    updater(fieldKey, editor.getContent())
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
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION')) {
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
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
      window.setTimeout(() => {
        window.quicktags && window.quicktags(window.tinyMCEPreInit.qtInit[ id ])
        window.switchEditors && window.switchEditors.go(id, 'tmce')
        // window.tinymce.execCommand('mceAddEditor', true, id)
      }, 0)
    }
  }

  render () {
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION')) {
      const { value } = this.state
      const { fieldKey } = this.props
      const id = `vcv-wpeditor-${fieldKey}`
      const template = document.getElementById('vcv-wpeditor-template').innerHTML
        .replace(/__VCVID__/g, id)
        .replace(/%%content%%/g, value)
      return <div className='vcv-ui-form-input vcv-ui-form-wp-tinymce' dangerouslySetInnerHTML={{__html: template}} />
    }
    return this.renderEditor()
  }
}
