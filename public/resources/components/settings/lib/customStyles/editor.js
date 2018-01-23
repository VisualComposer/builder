import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { env } from 'vc-cake'

import 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/css'
import 'brace/theme/github'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neo.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

export default class StyleEditor extends React.Component {
  editor = null

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
      /* eslint-disable */
      let codemirror = CodeMirror(this.editor, {
        value: this.props.value,
        mode: 'javascript',
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
          'CodeMirror-foldgutter'
        ]
      })
      /* eslint-enable */
    }
  }

  handleChange (value) {
    this.props.updater(this.props.name, value)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-style-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
    return (
      <div className={controlClass}>
        <div className='vcv-ui-style-ace-container' ref={editor => (this.editor = editor)}>
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
