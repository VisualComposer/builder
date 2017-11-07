import React from 'react'
import classNames from 'classnames'

import 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'
export default class ScriptEditor extends React.Component {
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    editorLabel: React.PropTypes.string,
    activeIndex: React.PropTypes.number,
    aceId: React.PropTypes.string,
    value: React.PropTypes.string,
    updater: React.PropTypes.func
  }
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (value) {
    this.props.updater(this.props.name, value)
  }
  render () {
    let controlClass = classNames({
      'vcv-ui-script-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
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
            editorProps={{$blockScrolling: true}}
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
