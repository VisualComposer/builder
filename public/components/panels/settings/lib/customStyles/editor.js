import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CodeEditor from '../../../../codeEditor/codeEditor'

import { getData, getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class StyleEditor extends React.Component {
  editorWrapper = null
  codeEditor = null

  static propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    activeIndex: PropTypes.number,
    value: PropTypes.string,
    updater: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'css', this.props.value)
    this.codeEditor.setSize('100%', '50vh')
    this.codeEditor.on('change', this.handleChange)
  }

  componentDidUpdate () {
    this.codeEditor.refresh()
  }

  handleChange () {
    this.props.updater(this.props.name, this.codeEditor.getValue())
    settingsStorage.state(this.props.settingsStorageState).set(getData(`ui:settings:customStyles:${this.props.name}`))
  }

  render () {
    const controlClass = classNames({
      'vcv-ui-style-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
    return (
      <div className={controlClass}>
        <textarea className='vcv-ui-style-ace-container' ref={editor => (this.editorWrapper = editor)} />
      </div>
    )
  }
}
