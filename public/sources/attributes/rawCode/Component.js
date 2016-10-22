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

  componentDidMount () {
    console.log(this.props)
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
          value={this.props.value}
        />
      </div>
    )
  }
}

