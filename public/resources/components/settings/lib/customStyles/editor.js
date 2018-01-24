import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { env } from 'vc-cake'

import 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/css'
import 'brace/theme/github'

import CodeMirror from 'codemirror'
import csslint from 'csslint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/css/css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/css-lint'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'

export default class StyleEditor extends React.Component {
  editor = null
  codemirror = null

  static propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    editorLabel: PropTypes.string,
    activeIndex: PropTypes.number,
    aceId: PropTypes.string,
    value: PropTypes.string,
    updater: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    if (env('CODEMIRROR')) {
      window.CSSLint = csslint.CSSLint
      /* eslint-disable */
      this.codemirror = CodeMirror(this.editor, {
        value: this.props.value,
        mode: 'css',
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
      this.codemirror.on('change', this.handleChange)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (env('CODEMIRROR')) {
      this.codemirror.refresh()
    }
  }

  handleChange (value) {
    value = env('CODEMIRROR') ? value.getValue() : value
    this.props.updater(this.props.name, value)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-style-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
    if (env('CODEMIRROR')) {
      return <div className={controlClass}>
        <div className='vcv-ui-style-ace-container' ref={editor => (this.editor = editor)} />
        <p className='vcv-ui-form-helper'>{this.props.editorLabel}</p>
      </div>
    }
    return (
      <div className={controlClass}>
        <div className='vcv-ui-style-ace-container'>
          <AceEditor
            width='100%'
            height='50vh'
            mode='css'
            theme='github'
            tabSize={2}
            name={this.props.aceId}
            editorProps={{ $blockScrolling: true }}
            showPrintMargin={false}
            value={this.props.value}
            onChange={this.handleChange}
          />
        </div>
        <p className='vcv-ui-form-helper'>{this.props.editorLabel}</p>
      </div>
    )
  }
}
