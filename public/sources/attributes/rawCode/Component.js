import React from 'react'
import Attribute from '../attribute'
import PropTypes from 'prop-types'

import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/mode/javascript'
import 'brace/theme/github'

import { env } from 'vc-cake'
import CodeEditor from '../../../resources/codeEditor/codeEditor'

export default class RawCode extends Attribute {
  editorWrapper = null
  codeEditor = null

  static propTypes = {
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
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

  constructor (props) {
    super(props)
    this.setValue = this.setValue.bind(this)
  }

  componentDidMount () {
    if (env('CODEMIRROR')) {
      const { value } = this.props
      if (this.props.options.mode === 'html') {
        // TODO: change rawHTML, wpWidgetsCustom, wpWidgetsDefault element options.mode setting to htmlmixed
        this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'htmlmixed', value)
      } else if (this.props.options.mode === 'javascript') {
        this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'javascript', value)
      }
      this.codeEditor.setSize('100%', this.props.options.height || '50vh')
      this.codeEditor.on('change', this.setValue)
    }
  }

  componentDidUpdate () {
    if (env('CODEMIRROR')) {
      this.codeEditor.refresh()
    } else {
      // Make the resize in case if dependency hidden
      if (this.refs.ace && this.refs.ace.editor) {
        this.refs.ace.editor.resize()
      }
    }
  }

  setValue (value) {
    this.setFieldValue(value.getValue())
  }

  render () {
    if (env('CODEMIRROR')) {
      return <div className='vcv-row-html-editor-container' ref={editor => (this.editorWrapper = editor)} />
    }
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

