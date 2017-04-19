import React from 'react'
import Attribute from '../attribute'

import AceEditor from 'react-ace'
import '../../../../node_modules/brace/mode/html'
import '../../../../node_modules/brace/mode/javascript'
import '../../../../node_modules/brace/theme/github'

export default class RawCode extends Attribute {
  static propTypes = {
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  }
  static defaultEditorOptions = {
    mode: 'html',
    width: '100%',
    height: '50vh',
    theme: 'github',
    tabSize: 2,
    showPrintMargin: false,
    editorProps: { $blockScrolling: true }
  }

  componentDidUpdate () {
    // Make the resize in case if dependency hidden
    if (this.refs.ace && this.refs.ace.editor) {
      this.refs.ace.editor.resize()
    }
  }

  render () {
    return (
      <div className='vcv-row-html-editor-container'>
        <AceEditor
          ref='ace'
          name={this.props.fieldKey}
          value={this.state.value}
          onChange={this.setFieldValue}
          mode={typeof this.props.options.mode === 'undefined' ? RawCode.defaultEditorOptions.mode : this.props.options.mode}
          width={typeof this.props.options.width === 'undefined' ? RawCode.defaultEditorOptions.width : this.props.options.width}
          height={typeof this.props.options.height === 'undefined' ? RawCode.defaultEditorOptions.height : this.props.options.height}
          theme={typeof this.props.options.theme === 'undefined' ? RawCode.defaultEditorOptions.theme : this.props.options.theme}
          tabSize={typeof this.props.options.tabSize === 'undefined' ? RawCode.defaultEditorOptions.tabSize : this.props.options.tabSize}
          showPrintMargin={typeof this.props.options.showPrintMargin === 'undefined' ? RawCode.defaultEditorOptions.showPrintMargin : this.props.options.showPrintMargin}
          editorProps={typeof this.props.options.editorProps === 'undefined' ? RawCode.defaultEditorOptions.editorProps : this.props.options.editorProps}
        />
      </div>
    )
  }
}

