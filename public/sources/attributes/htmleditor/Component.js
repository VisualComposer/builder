/*eslint no-unused-vars: [2, { "varsIgnorePattern": "tinymce" }]*/
import React from 'react'
import tinymce from 'tinymce/tinymce'
import TinyMceEditor from 'react-tinymce'
import 'tinymce/themes/modern/theme'
import './css/skin.css'
import './css/content.css'
import Attribute from '../attribute'
import lodash from 'lodash'

export default class Component extends Attribute {
  handleChange (event) {
    let value = event.target.getContent()
    this.setFieldValue(value)
  }

  render () {
    let { value } = this.state
    let { options } = this.props
    let tinymceConfig = lodash.extend({}, {
      toolbar: [
        'styleselect | bold italic | link image | alignleft aligncenter alignright'
      ], skin: false, menubar: false
    }, options.tinymce)
    return (
      <TinyMceEditor
        config={tinymceConfig}
        onChange={this.handleChange}
        content={value} />
    )
  }
}
