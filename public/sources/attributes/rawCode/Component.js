import React from 'react'
import Attribute from '../attribute'

import AceEditor from 'react-ace'
import '../../../../node_modules/brace/mode/html'
import '../../../../node_modules/brace/mode/javascript'
import '../../../../node_modules/brace/theme/github'

import './css/init.less'

export default class RawCode extends Attribute {
  static propTypes = {
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.handleAceInput = this.handleAceInput.bind(this)
    this.state = {
      codeValue: this.props.value
    }
  }

  handleAceInput (value) {
    this.setFieldValue(value)
    this.setState({codeValue: value})
  }

  render () {
    return (
      <div className='vcv-row-html-editor-container'>
        <AceEditor
          width='100%'
          height='50vh'
          mode={this.props.options.mode}
          theme='github'
          tabSize={2}
          name={this.props.fieldKey}
          editorProps={{$blockScrolling: true}}
          showPrintMargin={false}
          value={this.state.codeValue}
          onChange={this.handleAceInput}
        />
      </div>
    )
  }
}

