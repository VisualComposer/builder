import React from 'react'
import Attribute from '../attribute'
import PropTypes from 'prop-types'
import CodeEditor from '../../../resources/codeEditor/codeEditor'

export default class RawCode extends Attribute {
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

  componentDidUpdate (prevProps, prevState) {
    this.codeEditor.refresh()
  }

  setValue (value) {
    this.setFieldValue(value.getValue())
  }

  render () {
    return <div className='vcv-row-html-editor-container' ref={editor => (this.editorWrapper = editor)} />
  }
}
