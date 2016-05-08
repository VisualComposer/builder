import React from 'react';
import tinymce from 'tinymce/tinymce';
import Editor from 'react-tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/skins/lightgray/skin.min.css';
import 'tinymce/skins/lightgray/content.min.css';

export default class Component extends React.Component {
  componentDidMount() {
    console.log({htmlEditorComponentDidMount: this.refs});
  }

  render() {
    console.log({renderHtmlEditorAttribute: this.props});
    let {value} = this.props;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">Title</label>
        <Editor
          ref='TextAreaComponent'
          config={{
            skin: false,
            menubar: false
          }}
          content={value}/>
      </div>);
  }
}
