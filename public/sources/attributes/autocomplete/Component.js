import React from 'react'

import Attribute from '../attribute'
import TokenizationList from './lib/tokenizationList'
import PropTypes from 'prop-types'

export default class AutoComplete extends Attribute {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    handleDynamicFieldOpen: PropTypes.func,
    handleDynamicFieldChange: PropTypes.func,
    handleDynamicFieldClose: PropTypes.func,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.object.isRequired,
    elementAccessPoint: PropTypes.object.isRequired,
    description: PropTypes.string
  }

  static defaultProps = {
    fieldType: 'autocomplete'
  }

  validate (state) {
    return state
  }

  render () {
    const { value, fieldKey, elementAccessPoint, options, extraClass, description } = this.props
    const { validation, action, single, labelAction, returnValue } = options

    return (
      <TokenizationList
        onChange={this.setFieldValue}
        value={value}
        fieldKey={fieldKey}
        elementAccessPoint={elementAccessPoint}
        validator={this.validate}
        validation={validation}
        action={action}
        single={single}
        labelAction={labelAction}
        returnValue={returnValue}
        extraClass={extraClass}
        description={description}
      />
    )
  }
}
