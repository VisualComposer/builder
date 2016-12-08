/* eslint no-unused-vars: [2, { "varsIgnorePattern": "tinymce" }] */
import React from 'react'
import tinymce from 'tinymce/tinymce'
import TinyMceEditor from 'react-tinymce'
import 'tinymce/themes/modern/theme'
import './css/skin.css'
import './css/content.css'
import Attribute from '../attribute'
import lodash from 'lodash'
import vcCake from 'vc-cake'
// const dataProcessor = vcCake.getService('dataProcessor')

export default class HtmlEditorComponent extends Attribute {
  handleChange = (event, editor) => {
    let value = editor.getContent()
    this.setFieldValue(value)
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
      // let { value } = this.state
      /* dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxWpEditor:adminNonce',
        'vcv-content': value,
        'vcv-field-key': this.props.fieldKey,
        'vcv-nonce': window.vcvNonce
      }).then((data) => {
        // let range = document.createRange()
        // let wrapper =
        // let documentFragment = range.createContextualFragment(data)

        // this.setState({editor: data})
      })
      */
    }
  }
  render () {
    if (vcCake.env('FEATURE_HTML_EDITOR_WP_VERSION')) {
      let editorContent = this.state.editor || '<span className="vcv-ui-wp-spinner">Loading...</span>'
      return <div className='vcv-ui-form-input vcv-ui-form-wp-tinymce' dangerouslySetInnerHTML={{ __html: editorContent }} />
    }
    return this.renderEditor()
  }
}
