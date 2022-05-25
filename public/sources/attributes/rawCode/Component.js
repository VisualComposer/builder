import React from 'react'
import Attribute from '../attribute'
import PropTypes from 'prop-types'
import CodeEditor from '../../../components/codeEditor/codeEditor'

export default class RawCode extends Attribute {
  static defaultProps = {
    fieldType: 'rawCode'
  }

  editorWrapper = null
  codeEditor = null

  static propTypes = {
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.setValue = this.setValue.bind(this)
  }

  componentDidMount () {
    const { value } = this.props
    if (!this.props.options.mode || this.props.options.mode === 'html') {
      // TODO: change rawHTML, wpWidgetsCustom, wpWidgetsDefault element options.mode setting to htmlmixed
      this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'htmlmixed', value)
    } else if (this.props.options.mode === 'javascript') {
      this.codeEditor = CodeEditor.getEditor(this.editorWrapper, 'javascript', value)
    }
    this.codeEditor.setSize('100%', this.props.options.height || '50vh')
    this.codeEditor.on('change', this.setValue)
  }

  componentDidUpdate () {
    this.codeEditor.refresh()
  }

  setValue () {
    this.setFieldValue(this.codeEditor.getValue())
  }

  render () {
    return <textarea className='vcv-row-html-editor-container' ref={editor => (this.editorWrapper = editor)} />
  }
}
