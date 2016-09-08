/* eslint no-unused-vars: [2, { "varsIgnorePattern": "tinymce" }] */
import React from 'react'
import tinymce from 'tinymce/tinymce'
import TinyMceEditor from 'react-tinymce'
import 'tinymce/themes/modern/theme'
import './css/skin.css'
import './css/content.css'
import Attribute from '../attribute'
import lodash from 'lodash'

export default class HtmlEditorComponent extends Attribute {
  handleChange = (event) => {
    let value = event.target.getContent()
    this.setFieldValue(value)
  }

  render () {
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
          content={value} />
      </div>
    )
  }
}
