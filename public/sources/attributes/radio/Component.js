import React from 'react'
import Attribute from '../attribute'

export default class Radio extends Attribute {
  handleChange (event) {
    this.setFieldValue(event.currentTarget.value)
  }

  getValues () {
    const { props } = this
    let { values } = props.options || {}
    let { global } = props.options || {}
    if (global && (!values || !values.length)) {
      if (typeof window[ global ] === 'function') {
        values = window[ global ]()
      } else {
        values = window[ global ] || []
      }
    }

    return values
  }

  render () {
    let { fieldKey } = this.props
    let optionElements = []
    let values = this.getValues()
    let currentValue = this.state.value
    for (let key in values) {
      let value = values[ key ].value
      let checked = currentValue === value ? 'checked' : ''
      optionElements.push(
        <label key={`${fieldKey}:${key}:${value}`} className='vcv-ui-form-radio'>
          <input type='radio' name={`${fieldKey}`} onChange={this.handleChange} checked={checked} value={value} />
          <span className='vcv-ui-form-radio-indicator' />
          {values[ key ].label}
        </label>
      )
    }

    let classNames = 'vcv-ui-form-radio-buttons'
    if (this.props.options && this.props.options.listView) {
      classNames += ' vcv-ui-form-radio-buttons--list'
    }
    return (
      <div className={classNames}>
        {optionElements}
      </div>)
  }
}
