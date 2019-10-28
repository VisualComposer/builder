import React from 'react'
import HtmlEditor from './htmleditor'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const settingsStorage = getStorage('settings')
const blockRegexp = getBlockRegexp()
const exceptionalFieldTypes = ['wysiwyg', 'textarea']

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
    const exceptionField = this.getExceptionField(value, this.props.fieldType)

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
      isDynamicSet: true,
      exceptionField: exceptionField
    })

    return value
  }

  setValueState (value) {
    this.setState({ value: value })
  }

  setEditorLoaded (loadedState) {
    this.setState({ editorLoaded: loadedState })
  }

  getExceptionField (value, fieldType) {
    let isExceptionField = false
    const blockInfo = value && value.split(blockRegexp)
    if (blockInfo.length > 1) {
      const blockAtts = JSON.parse(blockInfo[ 4 ].trim())
      const fieldValue = blockAtts.value
      const isVendorValue = fieldValue.includes(':') && fieldValue.split(':')
      const postFields = settingsStorage.state('postFields').get()
      if (isVendorValue && postFields && postFields[ fieldType ]) {
        const vendorName = isVendorValue[ 0 ]
        const vendorValues = postFields[ fieldType ][ vendorName ].group.values
        const currentValue = vendorValues.find(item => item.value === fieldValue)
        isExceptionField = currentValue && currentValue.fieldType && exceptionalFieldTypes.includes(currentValue.fieldType)
      }
    }
    return isExceptionField
  }

  render () {
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && this.props.options && this.props.options.dynamicField

    const cssClasses = classNames({
      'vcv-ui-form-wp-tinymce': true,
      'vcv-is-invisible': this.state.editorLoaded !== true,
      'vcv-ui-form-field-dynamic-is-opened': this.state.dynamicFieldOpened,
      'vcv-ui-form-field-dynamic-is-active': this.state.isDynamicSet,
      'vcv-ui-form-field-has-dynamic': isDynamic,
      'vcv-ui-form-field-has-exception-field': this.state.exceptionField
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
