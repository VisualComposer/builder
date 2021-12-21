import React from 'react'
import Attribute from '../attribute'

export default class Datalist extends Attribute {
  static defaultProps = {
    fieldType: 'datalist'
  }

  selectChildren = null

  constructor (props) {
    super(props)
    this.generateSelectChildren(props)
  }

  createOptions (key, values, fieldKey) {
    const value = values[key].value
    const label = values[key].label
    return <option key={fieldKey + ':' + key + ':' + value} value={value}>{label}</option>
  }

  getSelectOptions (props) {
    if (!props) {
      props = this.props
    }
    let { values } = props.options || {}
    const { global } = props.options || {}
    if (global && (!values || !values.length)) {
      if (typeof window[global] === 'function') {
        values = window[global]()
      } else {
        values = window[global] || []
      }
    }

    return values
  }

  generateSelectChildren (props) {
    const optionElements = []
    const values = this.getSelectOptions(props)
    const { fieldKey } = props

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }

    this.selectChildren = optionElements
  }

  render () {
    const { value } = this.state
    return (
      <>
        <input className='vcv-ui-form-datalist' list={`vcv-data-list-${this.props.fieldKey}`} type='text' value={value} onChange={this.handleChange} />
        <datalist id={`vcv-data-list-${this.props.fieldKey}`}>
          {this.selectChildren}
        </datalist>
      </>
    )
  }
}
