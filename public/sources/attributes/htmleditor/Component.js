import React from 'react';
import tinymce from 'tinymce/tinymce';
import Editor from 'react-tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/skins/lightgray/skin.min.css';
import 'tinymce/skins/lightgray/content.min.css';
import Attribute from '../attribute';

export default class Component extends Attribute {
  handleChange(event) {
    event.target.value = event.target.getContent();
    super.handleChange(event);
  }

  render() {
    // TODO: fix title.
    let {value} = this.state;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">Title</label>
        <Editor
          config={{
            skin: false,
            menubar: false
          }}
          onChange={this.handleChange.bind(this)}
          content={value}/>
      </div>);
  }
}
