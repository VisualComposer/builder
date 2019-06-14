import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import { env, getService } from 'vc-cake'
import { getDynamicFieldsList } from 'public/components/dynamicFields/dynamicFields'
import Dropdown from '../dropdown/Component'

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
    let extraDynamicComponent = null

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

        let fieldList = getDynamicFieldsList(this.props.fieldType)
        fieldComponent = (
          <Dropdown
            value={blockAtts.value.replace(/^(.+)(::)(.+)$/, '$1$2')}
            fieldKey={`${this.props.fieldKey}-dynamic-dropdown`}
            options={{
              values: fieldList
            }}
            updater={this.handleDynamicFieldChange}
            extraClass='vcv-ui-form-field-dynamic'
          />
        )

        dynamicComponent = (
          <span className='vcv-ui-icon vcv-ui-icon-close vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldClose} title='Close Dynamic Field' />
        )
        if (blockAtts.value.match(/::/)) {
          const [ dynamicFieldValue, extraValue ] = blockAtts.value.split('::')
          const updateExtraValue = (e) => {
            const extraDynamicFieldValue = e.currentTarget && e.currentTarget.value
            this.updateDynamicFieldValues(`${dynamicFieldValue}::${extraDynamicFieldValue}`)
          }
          const extraDynamicFieldClassNames = classNames(fieldClassNames, {
            'vcv-ui-form-field-dynamic-extra': true
          })
          extraDynamicComponent =
            <input type='text' className={extraDynamicFieldClassNames} onChange={updateExtraValue} value={extraValue} placeholder='Enter valid meta key' />
        }
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
        {extraDynamicComponent}
      </React.Fragment>
    )
  }
}
