import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import { env, getService } from 'vc-cake'
import { getDynamicFieldsList } from 'public/components/dynamicFields/dynamicFields'

const { getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()

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
    let dynamicComponent = null

    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && options && options.dynamicField
    let fieldClassNames = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-form-field-dynamic': isDynamic
    })
    let fieldComponent = <input
      className={fieldClassNames}
      type='text'
      onChange={this.handleChange}
      placeholder={placeholder}
      value={value}
    />

    if (isDynamic) {
      if (typeof value === 'string' && value.match(blockRegexp)) {
        let blockInfo = value.split(blockRegexp)
        let blockAtts = JSON.parse(blockInfo[ 4 ].trim())

        let selectOptions = []
        let fieldList = getDynamicFieldsList(this.props.fieldType)
        let fieldKey = this.props.fieldKey
        fieldList.forEach((dynamicFieldItem, index) => {
          selectOptions.push(
            <option
              key={`dynamic-string-field-${fieldKey}-${index}-${dynamicFieldItem.key}`}
              value={dynamicFieldItem.key}
            >
              {dynamicFieldItem.label}
            </option>
          )
        })

        fieldComponent = (
          <select
            className='vcv-ui-form-dropdown vcv-ui-form-field-dynamic'
            value={blockAtts.value}
            onChange={this.handleDynamicFieldChange}
          >
            {selectOptions}
          </select>
        )

        dynamicComponent = (
          <span className='vcv-ui-icon vcv-ui-icon-close vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldClose} title='Close Dynamic Field' />
        )
      } else {
        dynamicComponent = (
          <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control ' onClick={this.handleDynamicFieldOpen} title='Open Dynamic Field' />
        )
      }
    }

    return (
      <React.Fragment>
        {fieldComponent}
        {dynamicComponent}
      </React.Fragment>
    )
  }
}
