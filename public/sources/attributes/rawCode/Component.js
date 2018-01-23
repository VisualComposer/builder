import React from 'react'
import Attribute from '../attribute'
import PropTypes from 'prop-types'

import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/mode/javascript'
import 'brace/theme/github'

import { env } from 'vc-cake'
import CodeMirror from 'codemirror'
import jshint from 'jshint'
import htmlhint from 'htmlhint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/lint/html-lint'

export default class RawCode extends Attribute {
  editor = null
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
      let mode
      if (this.props.options.mode === 'html') {
        window.HTMLHint = htmlhint.HTMLHint
        mode = 'htmlmixed'
      } else if (this.props.options.mode === 'javascript') {
        window.JSHINT = jshint.JSHINT
        mode = this.props.options.mode
      }
      /* eslint-disable */
      this.codemirror = CodeMirror(this.editor, {
        value: this.props.value,
        mode: mode,
        tabSize: 2,
        lineNumbers: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-\/': 'toggleComment',
          'Cmd-\/': 'toggleComment'
        },
        foldGutter: true,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ],
        nonEmpty: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
        continueComments: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        lint: true,
        lintOnChange: true
      })
      /* eslint-enable */
      this.codemirror.setSize('100%', '50vh')
      this.codemirror.on('change', this.setValue)
    }
  }

  componentDidUpdate () {
    if (env('CODEMIRROR')) {
      this.codemirror.refresh()
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
      return <div className='vcv-row-html-editor-container' ref={editor => (this.editor = editor)} />
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

