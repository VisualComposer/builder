/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "tinymce" }]*/
import React from 'react'
import tinymce from 'tinymce/tinymce'
import Editor from 'react-tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/skins/lightgray/skin.min.css'
import 'tinymce/skins/lightgray/content.min.css'
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
