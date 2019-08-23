import React from 'react'
import HtmlEditor from './htmleditor'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import classNames from 'classnames'
import { env, getService } from 'vc-cake'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

export default class HtmlEditorWrapper extends Attribute {
  static defaultProps = {
    fieldType: 'htmleditor'
  }

  constructor (props) {
    super(props)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.setValueState = this.setValueState.bind(this)
    this.setEditorLoaded = this.setEditorLoaded.bind(this)

    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && props.options && props.options.dynamicField
    const isDynamicSet = isDynamic && typeof this.state.value === 'string' && this.state.value.match(blockRegexp)
    this.state.dynamicFieldOpened = isDynamicSet
    this.state.isDynamicSet = isDynamicSet
  }

  handleDynamicFieldClose () {
    window.setTimeout(() => {
      this.setState({
        dynamicFieldOpened: false,
        isDynamicSet: false
      })
    }, 1)
  }

  handleDynamicFieldOpen (dynamicComponent) {
    this.setState({
      dynamicFieldOpened: true
    })
    if (dynamicComponent && dynamicComponent.state && dynamicComponent.state.blockInfo && dynamicComponent.state.blockInfo.value) {
      this.setState({
        isDynamicSet: true
      })
    }
  }

  handleDynamicFieldChange (dynamicFieldKey, sourceId, forceSaveSourceId = false) {
    // New html dynamic comment
    let value = this.props.handleDynamicFieldChange(dynamicFieldKey, sourceId, forceSaveSourceId)

    // Current value needed for .before/.after get, must be not encoded
    let dynamicValue = this.state.value
    let blockInfo = parseDynamicBlock(dynamicValue)

    if (blockInfo) {
      let before = blockInfo.beforeBlock || '<p>'
      let after = blockInfo.afterBlock || '</p>'
      value = before + value + after
    } else {
      value = `<p>${value}</p>`
    }

    this.setState({
      isDynamicSet: true
    })

    return value
  }

  setValueState (value) {
    this.setState({ value: value })
  }

  setEditorLoaded (loadedState) {
    this.setState({ editorLoaded: loadedState })
  }

  render () {
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && this.props.options && this.props.options.dynamicField

    const cssClasses = classNames({
      'vcv-ui-form-wp-tinymce': true,
      'vcv-is-invisible': this.state.editorLoaded !== true,
      'vcv-ui-form-field-dynamic-is-opened': this.state.dynamicFieldOpened,
      'vcv-ui-form-field-dynamic-is-active': this.state.isDynamicSet,
      'vcv-ui-form-field-has-dynamic': isDynamic
    })

    return <div className={cssClasses}>
      <HtmlEditor
        {...this.props}
        value={this.state.value} // Must be not encoded
        setFieldValue={this.setFieldValue}
        setValueState={this.setValueState}
        setEditorLoaded={this.setEditorLoaded}
        dynamicFieldOpened={this.state.dynamicFieldOpened}
        editorLoaded={this.state.editorLoaded}
      />
      <DynamicAttribute
        {...this.props}
        onOpen={this.handleDynamicFieldOpen}
        onClose={this.handleDynamicFieldClose}
        handleDynamicFieldChange={this.handleDynamicFieldChange}
        setFieldValue={this.setFieldValue}
        value={this.state.value} // Must be not encoded
      />
    </div>
  }
}
