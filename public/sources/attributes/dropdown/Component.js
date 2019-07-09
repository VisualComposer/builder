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
    extraClass: PropTypes.any
  }

  static defaultProps = {
    fieldType: 'dropdown'
  }

  selectChildren = null

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    this.generateSelectChildren(nextProps)
  }

  componentWillMount () {
    this.generateSelectChildren(this.props)
  }

  createGroup (key, groupObject, fieldKey) {
    let optionElements = []
    let { values, label } = groupObject
    let labelValue = label.replace(/\s+/g, '')
    for (let key in values) {
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
    let value = values[ key ].value
    let label = values[ key ].label
    let disabled = values[ key ].disabled
    let selected = values[ key ].selected
    return <option key={fieldKey + ':' + key + ':' + value} value={value} disabled={disabled} selected={selected}>{label}</option>
  }

  getSelectOptions (props) {
    if (!props) {
      props = this.props
    }
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

  generateSelectChildren (props) {
    let optionElements = []
    let values = this.getSelectOptions(props)
    let { fieldKey } = props

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        if (values[ key ].hasOwnProperty('group')) {
          let group = this.createGroup(key, values[ key ].group, fieldKey)
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

    return (
      <select
        value={value}
        onChange={this.handleChange}
        className={selectClass}>
        {this.selectChildren}
      </select>
    )
  }
}
