import React from 'react'
import classNames from 'classnames'

import AceEditor from 'react-ace'
import '../../../../../../node_modules/brace/mode/css'
import '../../../../../../node_modules/brace/theme/github'

export default class StyleEditor extends React.Component {
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    editorLabel: React.PropTypes.string,
    activeIndex: React.PropTypes.number,
    aceId: React.PropTypes.string,
    value: React.PropTypes.string,
    updater: React.PropTypes.func
  }
  handleChange (value) {
    this.props.updater(this.props.name, value)
  }
  render () {
    let controlClass = classNames({
      'vcv-ui-style-editor': true,
      'vcv-ui-style-editor--active': (this.props.index === this.props.activeIndex)
    })
    return (
      <div className={controlClass}>
        <div className='vcv-ui-style-ace-container'>
          <AceEditor
            width='100%'
            height='200px'
            mode='css'
            theme='github'
            name={this.props.aceId}
            editorProps={{$blockScrolling: true}}
            showPrintMargin={false}
            value={this.props.value}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <p className='vcv-ui-form-helper'>{this.props.editorLabel}</p>
      </div>
    )
  }
}
