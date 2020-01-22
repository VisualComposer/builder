import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import PropTypes from 'prop-types'

export default class Dropdown extends Attribute {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.any,
    extraClass: PropTypes.any,
    description: PropTypes.string
  }

  static defaultProps = {
    fieldType: 'dropdown'
  }

  selectChildren = null

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    super.UNSAFE_componentWillReceiveProps(nextProps)
    this.generateSelectChildren(nextProps)
  }

  UNSAFE_componentWillMount () {
    this.generateSelectChildren(this.props)
  }
  /* eslint-enable */

  createGroup (key, groupObject, fieldKey) {
    const optionElements = []
    const { values, label } = groupObject
    const labelValue = label.replace(/\s+/g, '')
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    if (!optionElements.length) {
      return null
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
  }

  createOptions (key, values, fieldKey) {
    const value = values[key].value
    const label = values[key].label
    const disabled = values[key].disabled
    const selected = values[key].selected
    return <option key={fieldKey + ':' + key + ':' + value} value={value} disabled={disabled} selected={selected}>{label}</option>
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
      if (values.hasOwnProperty(key)) {
        if (values[key].hasOwnProperty('group')) {
          const group = this.createGroup(key, values[key].group, fieldKey)
          if (group) {
            optionElements.push(group)
          }
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey))
        }
      }
    }

    this.selectChildren = optionElements
  }

  render () {
    const { value } = this.state
    const selectClass = classNames({
      'vcv-ui-form-dropdown': true
    }, this.props.extraClass)
    let description = ''
    if (this.props.description) {
      description = (<p className='vcv-ui-form-helper'>{this.props.description}</p>)
    }

    return (
      <>
        <select
          value={value}
          onChange={this.handleChange}
          className={selectClass}
        >
          {this.selectChildren}
        </select>
        {description}
      </>
    )
  }
}
