import React from 'react'
import Attribute from '../attribute'

export default class Radio extends Attribute {
  handleChange (event) {
    this.setFieldValue(event.currentTarget.value)
  }

  render () {
    let { fieldKey } = this.props
    let optionElements = []
    let values = this.props.options.values
    let currentValues = this.state.value
    for (let key in values) {
      let value = values[ key ].value
      let checked = currentValues && currentValues.indexOf(value) !== -1 ? 'checked' : ''
      optionElements.push(
        <label key={`${fieldKey}:${key}:${value}`} name={`${fieldKey}`} className='vcv-ui-form-radio'>
          <input type='radio' onChange={this.handleChange} checked={checked} value={value} />
          <span className='vcv-ui-form-radio-indicator' />
          {values[ key ].label}
        </label>
      )
    }
    return (
      <form className='vcv-ui-form-radio-buttons'>
        {optionElements}
      </form>)
  }
}
