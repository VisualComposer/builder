import React from 'react'

import Attribute from '../attribute'
import TokenizationList from './lib/tokenizationList'

export default class AutoComplete extends Attribute {

  validateSize (text) {
    return text
  }

  render () {
    return (
      <TokenizationList
        onChange={this.setFieldValue}
        value={this.props.value}
        fieldKey={this.props.fieldKey}
        element={this.props.element}
        validator={this.validateSize}
      />
    )
  }
}
