import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

import { env } from 'vc-cake'
import CodeEditor from '../../../../codeEditor/codeEditor'

export default class ScriptEditor extends React.Component {
  editorWrapper = null
  codeEditor = null

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
      this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'javascript', this.props.value)
      this.codeEditor.setSize('100%', '50vh')
      this.codeEditor.on('change', this.handleChange)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (env('CODEMIRROR')) {
      this.codeEditor.refresh()
    }
  }

  handleChange (value) {
    value = env('CODEMIRROR') ? value.getValue() : value
    this.props.updater(this.props.name, value)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-script-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
    if (env('CODEMIRROR')) {
      return <div className={controlClass}>
        <div className='vcv-ui-script-ace-container' ref={editor => (this.editorWrapper = editor)} />
        <p className='vcv-ui-form-helper'>{this.props.editorLabel}</p>
      </div>
    }
    return (
      <div className={controlClass}>
        <div className='vcv-ui-script-ace-container'>
          <AceEditor
            width='100%'
            height='50vh'
            mode='javascript'
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
