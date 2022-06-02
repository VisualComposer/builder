import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CodeEditor from '../../../../codeEditor/codeEditor'

export default class HtmlEditor extends React.Component {
  editorWrapper = null
  codeEditor = null

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    updater: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount () {
    this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'text/html', this.props.value)
    this.codeEditor.setSize('100%', '50vh')
    this.codeEditor.on('blur', this.handleBlur)
  }

  componentDidUpdate () {
    this.codeEditor.refresh()
  }

  handleBlur () {
    this.props.updater(this.props.name, this.codeEditor.getValue())
  }

  render () {
    const controlClass = classNames({
      'vcv-ui-script-editor': true,
      'vcv-ui-state--active': true
    })

    return (
      <div className={controlClass}>
        <textarea className='vcv-ui-script-ace-container' ref={editor => (this.editorWrapper = editor)} />
      </div>
    )
  }
}
