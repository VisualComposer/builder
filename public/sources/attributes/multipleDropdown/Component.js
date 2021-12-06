import React from 'react'
import Attribute from '../attribute'
import { isEqual } from 'lodash'

export default class MultipleDropdown extends Attribute {
  static defaultProps = {
    fieldType: 'multipleDropdown'
  }

  selectChildren = null

  constructor (props) {
    super(props)
    this.generateSelectChildren(this.props)
  }

  componentDidUpdate (prevProps) {
    super.componentDidUpdate(prevProps)
    if (!isEqual(prevProps, this.props)) {
      this.generateSelectChildren(this.props)
    }
  }

  createGroup (key, groupObject, fieldKey) {
    const optionElements = []
    const { values, label } = groupObject
    const labelValue = label.replace(/\s+/g, '')
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
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
        if (Object.prototype.hasOwnProperty.call(values[key], 'group')) {
          optionElements.push(this.createGroup(key, values[key].group, fieldKey))
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey))
        }
      }
    }

    this.selectChildren = optionElements
  }

  handleChange (event) {
    const options = event.target.options
    const value = []
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }

    this.setFieldValue(value)
  }

  render () {
    const { value } = this.state
    return (
      <select
        multiple
        value={value}
        onChange={this.handleChange}
        className='vcv-ui-form-input vcv-ui-form-dropdown-multiple'
      >
        {this.selectChildren}
      </select>
    )
  }
}
