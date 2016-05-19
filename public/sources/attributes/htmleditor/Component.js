/*eslint no-unused-vars: [2, { "varsIgnorePattern": "tinymce" }]*/
import React from 'react'
import tinymce from 'tinymce/tinymce'
import Editor from 'react-tinymce'
import 'tinymce/themes/modern/theme'
import './css/skin.css'
import './css/content.css'
import Attribute from '../attribute'

export default class Component extends Attribute {
  handleChange (event) {
    var value = event.target.getContent()
    this.setFieldValue(value)
  }

  render () {
    let { value } = this.state
    return (
      <Editor
        config={{skin: false, menubar: false}}
        onChange={this.handleChange}
        content={value} />
    )
  }
}
