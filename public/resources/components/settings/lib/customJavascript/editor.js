import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CodeEditor from '../../../../codeEditor/codeEditor'
import { getData, getStorage, env } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class ScriptEditor extends React.Component {
  editorWrapper = null
  codeEditor = null

  static propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    editorLabel: PropTypes.string,
    activeIndex: PropTypes.number,
    value: PropTypes.string,
    updater: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount () {
    this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'javascript', this.props.value)
    this.codeEditor.setSize('100%', '50vh')
    this.codeEditor.on('change', this.handleChange)
    this.codeEditor.on('blur', this.handleBlur)
  }

  componentDidUpdate (prevProps, prevState) {
    this.codeEditor.refresh()
  }

  handleChange () {
    this.props.updater(this.props.name, this.codeEditor.getValue())
  }

  handleBlur () {
    settingsStorage.state(`${this.props.name}Js`).set(getData(`ui:settings:customJavascript:${this.props.name}`))
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-script-editor': true,
      'vcv-ui-state--active': (this.props.index === this.props.activeIndex)
    })
    return <div className={controlClass}>
      <textarea className='vcv-ui-script-ace-container' ref={editor => (this.editorWrapper = editor)} />
      { env('FT_JS_SETTINGS') ? null : <p className='vcv-ui-form-helper'>{ this.props.editorLabel }</p> }
    </div>
  }
}
