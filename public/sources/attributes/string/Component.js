import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import { env } from 'vc-cake'

export default class StringAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'string'
  }

  render () {
    let { value } = this.state
    let { placeholder, options } = this.props
    if (!placeholder && this.props.options && this.props.options.placeholder) {
      placeholder = this.props.options.placeholder
    }

    let fieldClassNames = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-form-field-dynamic': env('VCV_JS_FT_DYNAMIC_FIELDS') && options && options.dynamicField && !(this.props.editFormOptions && this.props.editFormOptions.nestedAttr)
    })
    let fieldComponent = <input
      className={fieldClassNames}
      type='text'
      onChange={this.handleChange}
      placeholder={placeholder}
      value={value}
    />

    return (
      <DynamicAttribute {...this.props} setFieldValue={this.setFieldValue} value={value}>
        {fieldComponent}
      </DynamicAttribute>
    )
  }
}
